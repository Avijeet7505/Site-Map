'use client';
import React, { useRef, useState } from 'react';
import { TextInput, TextInputProps, ActionIcon, useMantineTheme, rem, Container, Text } from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

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
                    toast.success('User Registered Successfully');
                }
                else {
                    toast.error('User Registration Failed');
                }
            }).catch((err) => {
                console.log(err);
                toast.error('Server Error')
            });
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
    )
}

export default SitemapGenerator;