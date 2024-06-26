const { existsSync, mkdirSync, writeFile } = require('fs');
const { promisify } = require('util');
const { launch } = require('puppeteer');
const { sharp } = require('sharp');
// const { del } = require('del');


const getOutputDirectory = (url) => {
    return `output/${slugify(url)}`;
}
// const URL = process.env.URL || 'https://digipodium.com/';
const SCREENSHOTS = process.argv.includes('--screenshots');
const DEPTH = parseInt(process.env.DEPTH) || 2;
const VIEWPORT = SCREENSHOTS ? { width: 1028, height: 800, deviceScaleFactor: 2 } : null;
// const OUT_DIR = process.env.OUTDIR || `output/${slugify(URL)}`;

const crawledPages = new Map();
const maxDepth = DEPTH; // Subpage depth to crawl site.

function slugify(str) {
    return str.replace(/[\/:]/g, '_');
}

function _mkdirSync(dirPath) {
    try {
        dirPath.split('/').reduce((parentPath, dirName) => {
            const currentPath = parentPath + dirName;
            if (!existsSync(currentPath)) {
                _mkdirSync(currentPath);
            }
            return currentPath + '/';
        }, '');
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }

}

/**
 * Finds all anchors on the page, inclusive of those within shadow roots.
 * Note: Intended to be run in the context of the page.
 * @param {boolean=} sameOrigin When true, only considers links from the same origin as the app.
 * @return {!Array<string>} List of anchor hrefs.
 */
function collectAllSameOriginAnchorsDeep(sameOrigin = true) {
    const allElements = [];

    const findAllElements = function (nodes) {
        for (let i = 0, el; el = nodes[i]; ++i) {
            allElements.push(el);
            // If the element has a shadow root, dig deeper.
            if (el.shadowRoot) {
                findAllElements(el.shadowRoot.querySelectorAll('*'));
            }
        }
    };

    findAllElements(document.querySelectorAll('*'));

    const filtered = allElements
        .filter(el => el.localName === 'a' && el.href) // element is an anchor with an href.
        .filter(el => el.href !== location.href) // link doesn't point to page's own URL.
        .filter(el => {
            if (sameOrigin) {
                return new URL(location).origin === new URL(el.href).origin;
            }
            return true;
        })
        .map(a => a.href);

    return Array.from(new Set(filtered));
}

/**
 * Crawls a URL by visiting an url, then recursively visiting any child subpages.
 * @param {!Browser} browser
 * @param {{url: string, title: string, img?: string, children: !Array<!Object>}} page Current page.
 * @param {number=} depth Current subtree depth of crawl.
 */
async function crawl(url, browser, page, depth = 0) {
    if (depth > maxDepth) {
        return;
    }

    // If we've already crawled the URL, we know its children.
    if (crawledPages.has(page.url)) {
        console.log(`Reusing route: ${page.url}`);
        const item = crawledPages.get(page.url);
        page.title = item.title;
        page.img = item.img;
        page.children = item.children;
        // Fill in the children with details (if they already exist).
        // page.children.forEach(c => {
        //     const item = crawledPages.get(c.url);
        //     c.title = item ? item.title : '';
        //     c.img = item ? item.img : null;
        // });
        return;
    } else {
        console.log(`Loading: ${page.url}`);

        const newPage = await browser.newPage();
        await newPage.goto(page.url, { waitUntil: 'networkidle2' });

        let anchors = await newPage.evaluate(collectAllSameOriginAnchorsDeep);
        anchors = anchors.filter(a => a !== URL) // link doesn't point to start url of crawl.

        page.title = await newPage.evaluate('document.title');
        page.children = anchors.map(url => ({ url }));

        if (SCREENSHOTS) {
            const path = `./${getOutputDirectory(url)}/${slugify(page.url)}.png`;
            let imgBuff = await newPage.screenshot({ fullPage: false });
            imgBuff = await sharp(imgBuff).resize(null, 150).toBuffer(); // resize image to 150 x auto.
            promisify(writeFile)(path, imgBuff); // async
            page.img = `data:img/png;base64,${imgBuff.toString('base64')}`;
        }

        crawledPages.set(page.url, page); // cache it.

        await newPage.close();
    }

    // Crawl subpages.
    for (const childPage of page.children) {
        await crawl(url, browser, childPage, depth + 1);
    }
}

const generateSitemap = async (url, persist) => {


    try {
        mkdirSync(getOutputDirectory(url)); // create output dir if it doesn't exist.
    } catch (error) {
        console.log(error);
    }
    // if(!persist) {
    //     await del([`${OUT_DIR}/*`]);
    // }

    const browser = await launch();
    const page = await browser.newPage();
    if (VIEWPORT) {
        await page.setViewport(VIEWPORT);
    }
    const root = { url };
    try {
        await crawl(url, browser, root);
        console.log(root);
        await promisify(writeFile)(`./${getOutputDirectory(url)}/crawl.json`, JSON.stringify(root, null, ' '));
        await browser.close();
        return `${getOutputDirectory(url)}/crawl.json`;
    } catch (error) {
        console.log(error);
    }
}

module.exports = generateSitemap;