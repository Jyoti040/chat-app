import React, { lazy, Suspense, useState } from 'react'
import { AppBar, Backdrop, Badge, Box, createTheme, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '../../constants/colors'
import { Add, DarkMode, Group, LightMode, Logout, Menu, NotificationAdd, Notifications, Person, Search as SearchIcon, WbSunny } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../constants/config'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import { setIsMobile, setIsNotification, setIsSearch, setIsNewGroup, setShowProfile } from '../../redux/reducers/misc'
import { resetNotification } from '../../redux/reducers/chat.js'

const SearchDialog = lazy(() => import('../specific/Search'))
const NotificationsDialog = lazy(() => import('../specific/Notifications'))
const NewGroupDialog = lazy(() => import('../specific/NewGroup'))

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc)
    const { notificationCount } = useSelector((state) => state.chat)

    const openSearchDiagloue = () => {
        dispatch(setIsSearch(true))
        //  setIsSearch((prev)=>!prev)
        console.log('in search box')
    }

    const openNewGroup = () => {
        dispatch(setIsNewGroup(true))
        console.log('in new grp')
    }

    const navigateToGroups = () => {
        console.log('in navigate grp')
        navigate('/groups')
    }

    const openNotifications = () => {
        dispatch(setIsNotification(true))
        dispatch(resetNotification())
        console.log('in notifications')
    }

    const handleLogout = async () => {

        try {
            const { data } = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true })
            console.log('in logout ', data)
            toast.success(data.message)
            dispatch(userNotExists())

            navigate("/")
        } catch (error) {
            console.log('in logout error ', error)
            toast.error(error?.response?.data?.message || "Something went wrong ")
        }
    }

    const handleGoToProfile = () => {
        console.log('in profile section')
        // navigate('/profile/1')
        dispatch(setShowProfile(true))
    }

    const handleMobile = () => {
        dispatch(setIsMobile(true))
    }

    return (
        <>
            <Box sx={{ flexGrow: 1, height: "4rem" }}>
                <AppBar
                    position='static' sx={{ bgcolor: orange }}
                >
                    <Toolbar>
                        <Typography variant='h4' sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Chat App
                        </Typography>
                        <Box sx={{ display: { xs: 'block', sm: 'none' }, }}>
                            <IconButton color='inherit' onClick={handleMobile}>
                                <Menu />
                            </IconButton>
                        </Box>
                        <Box sx={{ flexGrow: "1" }}
                        />
                        <Box>
                            <IconBtn title={'Search a user'} Icon={<SearchIcon />} func={openSearchDiagloue} />
                            <IconBtn title={'New Group'} Icon={<Add />} func={openNewGroup} />
                            <IconBtn title={'Manage Groups'} Icon={<Group />} func={navigateToGroups} />
                            <IconBtn title={'Notifications'} Icon={<Notifications />} func={openNotifications} value={notificationCount} />
                            <IconBtn title={'My Profile'} Icon={<Person />} func={handleGoToProfile} />
                            <IconBtn title={'Logout'} Icon={<Logout />} func={handleLogout} />
                            {/* <Tooltip title="Change Theme">
                                <IconButton color='inherit' size='large' onClick={handleToogleTheme}>
                                    {
                                       darkMode ? <LightMode/>:<DarkMode/>
                                    }
                                </IconButton>
                            </Tooltip> */}
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

            {
                isSearch && <Suspense fallback={<Backdrop open={isSearch} />}>
                    <SearchDialog />
                </Suspense>
            }
            {
                isNotification && <Suspense fallback={<Backdrop open />}>
                    <NotificationsDialog />
                </Suspense>
            }
            {
                isNewGroup && <Suspense fallback={<Backdrop open={isNewGroup} />}>
                    <NewGroupDialog />
                </Suspense>
            }
        </>
    )
}

const IconBtn = ({ title, Icon, func, value }) => {
    //  console.log("in icon button header ",title," ",value)
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={func}>
                {
                    value ? <Badge badgeContent={value} color='secondary'>{Icon}</Badge> : Icon
                }
            </IconButton>
        </Tooltip>
    )
}
export default Header