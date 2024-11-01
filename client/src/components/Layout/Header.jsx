import React, { lazy } from 'react'
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '../../constants/colors'
import { Add, Group, Logout, Menu, NotificationAdd, Notifications, Search } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const searchDialog = lazy(()=>import('../Shared/Search'))
const notificationDialog = lazy(()=>import('../Shared/Notifications'))
const newGroupDialog = lazy(()=>import('../Shared/NewGroup'))

const Header = () => {
    const navigate = useNavigate()
    
    const openSearchDiagloue = () => {
        console.log('in search box')
    }
    const openNewGroup = () => {
        console.log('in new grp')
    }
    const navigateToGroups = () => {
        console.log('in navigate grp')
        navigate('/groups')
    }
    const openNotifications = () => {
        console.log('in notifications')
        
    }
    const handleLogout = () => {
        console.log('in logout ')
        
    }

    return (
        <Box sx={{ flexGrow: 1, height: "4rem" }}>
            <AppBar
                position='static' sx={{ bgcolor: orange }}
            >
                <Toolbar>
                    <Typography variant='h4' sx={{ display: { xs: 'none', sm: 'block' } }}>
                        Chat App
                    </Typography>
                    <Box sx={{ display: { xs: 'block', sm: 'none' }, }}>
                        <IconButton color='inherit'>
                            <Menu />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: "1" }}
                    />
                    <Box>
                        <IconBtn  title={'Search a user'} Icon={<Search />} func={openSearchDiagloue}/>
                        <IconBtn  title={'New Group'} Icon={<Add />} func={openNewGroup}/>
                        <IconBtn  title={'Manage Groups'} Icon={<Group />} func={navigateToGroups}/>
                        <IconBtn  title={'Notifications'} Icon={<Notifications />} func={openNotifications}/>
                        <IconBtn  title={'Logout'} Icon={<Logout />} func={handleLogout}/>
                        {/* <Tooltip title='Search a user'>
                            <IconButton color='inherit' size='large' onClick={openSearchDiagloue}>
                                <Search />
                            </IconButton>
                        </Tooltip> */}
                        {/* <Tooltip title='New Group'>
                            <IconButton color='inherit' size='large' onClick={openNewGroup}>
                                <Add />
                            </IconButton>
                        </Tooltip> */}
                        {/* <Tooltip title='Manage Groups'>
                            <IconButton color='inherit' size='large' onClick={navigateToGroups}>
                                <Group />
                            </IconButton>
                        </Tooltip> */}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

const IconBtn = ({ title, Icon, func}) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={func}>
                {Icon}
            </IconButton>
        </Tooltip>
    )
}
export default Header