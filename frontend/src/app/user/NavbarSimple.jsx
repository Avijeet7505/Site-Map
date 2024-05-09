'use client'
import Link from 'next/link';
import { ActionToggle } from './ActionToggle';
import { Children, useState } from 'react';
import { Group, Code, AppShell, Burger, Skeleton, Text } from '@mantine/core';
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLogout,
    IconUser,
    IconClipboard,
    IconGardenCart,
    IconCarGarage,
    IconAugmentedReality,
    IconHome,
} from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './NavbarSimple.module.css';
import { useDisclosure } from '@mantine/hooks';


const data = [
    { link: '', label: 'User-Home', icon: IconHome },
    { link: '/profile', label: 'User Profile', icon: IconUser },
    { link: '/sitemap-generater', label: 'Sitemap-Generator', icon: IconAugmentedReality },
    { link: '', label: 'Feedback', icon: IconClipboard },
    // { link: '', label: 'SSH Keys', icon: IconKey },
    // { link: '', label: 'Databases', icon: IconDatabaseImport },
    // { link: '', label: 'Authentication', icon: Icon2fa },
    { link: '', label: 'Other Settings', icon: IconSettings },
];

export function NavbarSimple() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    const [active, setActive] = useState('Billing');

    const links = data.map((item) => (
        <a
            className={classes.link}
            data-active={item.label === active || undefined}
            href={item.link}
            key={item.label}
            onClick={(event) => {
                event.preventDefault();
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </a>
    ));

    return (
        <AppShell header={{ height: 60 }}
            navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
            padding="md">
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="lg" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="lg" />
                    <ActionToggle ></ActionToggle>
                    {/* <MantineLogo size={30} /> */}
                </Group>
            </AppShell.Header>
            <AppShell.Navbar>
                <nav className={classes.navbar}>
                    <div className={classes.navbarMain}>
                        <Group className={classes.header} justify="space-between">
                            <Group h="100%" gap={0} ><img src="/logo.png" style={{ height: 60, width: 60 }} alt="" /><Text fw={800} size='18px' >SiteMap</Text></Group>
                            {/* <MantineLogo size={28} />
                            <Code fw={700}>v3.1.2</Code> */}
                        </Group>
                        {links}
                    </div>

                    <div className={classes.footer}>
                        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                            <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                            <span>Change account</span>
                        </a>

                        <Link href='/login' className={classes.link} >
                            <IconLogout className={classes.linkIcon} stroke={1.5} />
                            <span>Logout</span>
                        </Link>
                    </div>
                </nav>
            </AppShell.Navbar>
            <AppShell.Main>abcd</AppShell.Main>
        </AppShell>
    );
}