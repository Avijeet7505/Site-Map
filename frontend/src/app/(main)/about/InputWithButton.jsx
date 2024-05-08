'use client'

import { TextInput, TextInputProps, ActionIcon, useMantineTheme, rem, Container, Text } from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

export function InputWithButton() {
    const theme = useMantineTheme();

    return (
        <Container py='xl'>
            <Text fw={990} size='37px' pb='lg'>Just enter your website URL to create a sitemap</Text>
            <TextInput
                radius="xl"
                size="md"
                placeholder="Search questions"
                rightSectionWidth={42}
                leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
                rightSection={
                    <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled">
                        <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    </ActionIcon>
                }
            />
        </Container>
    );
}