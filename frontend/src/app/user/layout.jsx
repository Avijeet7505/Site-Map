
'use client'
import React from 'react'
import { CollapseDesktop } from './CollapseDesktop'
import { NavbarSimple } from './NavbarSimple'

const UserLayout = ({ Children }) => {
    return (
        <>
            {/* <CollapseDesktop></CollapseDesktop> */}
            <NavbarSimple></NavbarSimple>
            {Children}
        </>
    )
}

export default UserLayout;