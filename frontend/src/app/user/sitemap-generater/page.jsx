'use client';
import React, { useRef, useState } from 'react';
import { TextInput, TextInputProps, ActionIcon, useMantineTheme, rem, Container, Text, Box, Textarea, Grid, SimpleGrid, Group, Button, Flex } from '@mantine/core';
import { IconSearch, IconArrowRight, IconDownload } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { ButtonCopy } from './ButtonCopy';
import { Demo } from './Demo';

const SitemapGenerator = () => {

    const theme = useMantineTheme();
    const inputRef = useRef();

    const [currentUser, setCurrentUser] = useState(JSON.parse(sessionStorage.getItem('user')));

    const saveSitemap = () => {
        fetch('http://localhost:5500/sitemap/add',
            {
                method: 'POST', body: JSON.stringify({
                    user: currentUser._id,
                    title: inputRef.current.value,
                    url: inputRef.current.value,
                    file: ''
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((response) => {
                console.log(response.status);
                if (response.status === 200) {
                    toast.success('Site-map Generation in Process');
                }
                else {
                    toast.error('Process  Failed! Try Again Later');
                }
            }).catch((err) => {
                console.log(err);
                toast.error('Server Error')
            });
    }

    const loadSitemap = (directory) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/load-sitemap/${directory}/crawl.json`)
            .then(res => res.json())
            .then(data => {
                setSitemapJSON(data)
            })
    }

    const generateSitemap = () => {
        fetch('http://localhost:5500/sitemap/generate', {
            method: 'POST',
            body: JSON.stringify({
                url: inputRef.current.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                saveSitemap();
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Box>
            <Container py='xl'>
                <Text fw={990} size='37px' pb='lg'>Just enter your website URL to create a sitemap</Text>
                <TextInput
                    ref={inputRef}
                    radius="xl"
                    size="md"
                    placeholder="Search questions"
                    rightSectionWidth={42}
                    leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                    rightSection={
                        <ActionIcon onClick={generateSitemap} size={32} radius="xl" color={theme.primaryColor} variant="filled">
                            <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                        </ActionIcon>
                    }
                />
            </Container>
            <Container size='xl'>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={20} >
                    <Group>
                        <Group justify='flex-end' w={'100%'}>
                            <Demo></Demo>
                            <Button rightSection={<IconDownload size={14} />}>Download</Button>
                            <Textarea w={'100%'} rows={20} />
                        </Group>
                    </Group>
                    <Group>
                        <Group justify='flex-end' w={'100%'}>
                            <Demo></Demo>
                            <Button size='xs' rightSection={<IconDownload size={14} />}>Download</Button>
                            <Textarea w={'100%'} rows={20} />
                        </Group>
                    </Group>
                </SimpleGrid>
            </Container>
        </Box>
    )
}

export default SitemapGenerator;