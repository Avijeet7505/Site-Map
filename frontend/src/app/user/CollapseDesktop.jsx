'use client'
import { AppShell, Burger, Group, Skeleton, Text, MantineProvider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { ActionToggle } from './ActionToggle';


export function CollapseDesktop() {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);


    return (
        <MantineProvider
            theme={{
                colors: {
                    'ocean-blue': ['#7AD1DD', '#5FCCDB', '#44CADC', '#2AC9DE', '#1AC2D9', '#11B7CD', '#09ADC3', '#0E99AC', '#128797', '#147885'],
                    'bright-pink': ['#F0BBDD', '#ED9BCF', '#EC7CC3', '#ED5DB8', '#F13EAF', '#F71FA7', '#FF00A1', '#E00890', '#C50E82', '#AD1374'],
                },
            }}
        >

            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: 'sm',
                    collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
                }}
                padding="md"
            >
                <AppShell.Header>
                    <Group h="100%" px="md" bg={'#147885'}>
                        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="lg" />
                        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="lg" />
                        <Group h="100%" gap={0} ><img src="/logo.png" style={{ height: 60, width: 60 }} alt="" /><Text fw={800} size='18px' >SiteMap</Text></Group>
                        {/* <ActionToggle ></ActionToggle> */}
                        {/* <MantineLogo size={30} /> */}
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar p="lg">
                    User
                    {Array(5)
                        .fill(10)
                        .map((_, index) => (
                            <Skeleton key={index} h={50} mt="lg" animate={false} />
                        ))}
                </AppShell.Navbar>
                <AppShell.Main>Main</AppShell.Main>
            </AppShell>
        </MantineProvider >
    );
}