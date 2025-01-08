import React, { lazy, Suspense, useState } from 'react'
import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '../../constants/colors'
import { Add, Group, Logout, Menu, NotificationAdd, Notifications, Person, Search as SearchIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../../constants/config'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../redux/reducers/auth'
import { setIsMobile, setIsNotification, setIsSearch } from '../../redux/reducers/misc'

const SearchDialog = lazy(()=>import('../specific/Search'))
const NotificationsDialog= lazy(()=>import('../specific/Notifications'))
const NewGroupDialog = lazy(()=>import('../specific/NewGroup'))

const Header = () => {
    const navigate = useNavigate()
   const {isSearch , isNotification} = useSelector((state)=>state.misc)
    const [isNewGorup,setIsNewGorup]=useState(false)
    const dispatch = useDispatch()

    const openSearchDiagloue = () => {
        dispatch(setIsSearch(true))
      //  setIsSearch((prev)=>!prev)
        console.log('in search box')
    }

    const openNewGroup = () => {
        setIsNewGorup((prev)=>!prev)
        console.log('in new grp')
    }
    
    const navigateToGroups = () => {
        console.log('in navigate grp')
        navigate('/groups')
    }

    const openNotifications = () => {
        dispatch(setIsNotification(true))
        console.log('in notifications')
        
    }
    
    const handleLogout = async() => {
        console.log('in logout ')
        try {
            const {data} = axios.get(`${server}/api/v1/user/logout`,{withCredentials:true})
            toast.success(data.message)
            dispatch(userNotExists())
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong ")
        }
    }

    const handleGoToProfile=()=>{
        console.log('in profile section')
        navigate('/profile/1')
    }

    const handleMobile=()=>{
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
                        <IconButton color='inherit'>
                            <Menu />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: "1" }}
                    />
                    <Box>
                        <IconBtn  title={'Search a user'} Icon={<SearchIcon />} func={openSearchDiagloue}/>
                        <IconBtn  title={'New Group'} Icon={<Add />} func={openNewGroup}/>
                        <IconBtn  title={'Manage Groups'} Icon={<Group />} func={navigateToGroups}/>
                        <IconBtn  title={'Notifications'} Icon={<Notifications />} func={openNotifications}/>
                        <IconBtn  title={'My Profile'} Icon={<Person />} func={handleGoToProfile}/>
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

        {
            isSearch &&<Suspense fallback={<Backdrop open/>}>
                <SearchDialog/>
            </Suspense>
        }
        {
            isNotification &&<Suspense fallback={<Backdrop open/>}>
                <NotificationsDialog/>
            </Suspense>
        }
        {
            isNewGorup &&<Suspense fallback={<Backdrop open/>}>
                <NewGroupDialog/>
            </Suspense>
        }
       </>
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