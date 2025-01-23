import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header'
import Title from '../Shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatLists from '../specific/ChatLists'
import { useNavigate, useParams } from 'react-router-dom'
import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu, setIsMobile, setSelectedDeletedChat } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'
import { useErrors, useSocketEvents } from '../../hooks/hooks'
import Profile from '../specific/Profile'
import { getSocket } from '../../socket'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat.js'
import { getOrSaveFromLocalStorage } from '../../lib/features.js'
import DeleteChatMenu from '../dialog/DeleteChatMenu.jsx'
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/config.js'

const AppLayout = () => (WrappedComponent)=> {  //HOC - Higher order component
  return (props)=>{

    const dispatch = useDispatch()
    const params = useParams()
    const navigate = useNavigate()
    const deleteMenuAnchor = useRef(null)

    const [onlineUsers , setOnlineUsers] = useState([])

    const {isMobile} = useSelector((state)=>state.misc)
    const {user} = useSelector((state)=>state.auth)
    const {newMessagesAlert} = useSelector((state)=>state.chat)

    const chatID= params.chatID;

    const socket = getSocket()

    const {isLoading , data , isError , error , refetch} = useMyChatsQuery("")
    console.log("in app layout new msg alert  ",newMessagesAlert)

    useEffect(()=>{
      getOrSaveFromLocalStorage({key:"new_message_alert",value:newMessagesAlert,get:false})
      
    },[newMessagesAlert])

    const handleDeleteChat=(e,_id,groupchat)=>{
      console.log('in delete chat')
      e.preventDefault();
      dispatch(setIsDeleteMenu(true))
      dispatch(setSelectedDeletedChat({chatId:chatID,groupchat}))
      deleteMenuAnchor.current = e.curretTarget
    }

    const handleMobileClose=()=>{
       dispatch(setIsMobile(false))
    }

    // useEffect(()=>{
    //    if(isError){
    //        toast.error(error?.response?.data?.message || "Something went wrong")
    //    }
    // },[isError , error ])

    const newMessageAlertHandler = useCallback((data)=>{
      if(data.chatId === chatID) return 
       dispatch(setNewMessagesAlert(data))
    },[chatID])

    const newRequestHandler = useCallback(()=>{
      dispatch(incrementNotification())
    },[dispatch])

    const refetchChatHandler = useCallback(()=>{
      refetch()
      navigate("/")
    },[refetch , navigate])

    const onlineUsersHandler = useCallback((data)=>{
     setOnlineUsers(data)
    },[])

    const eventHandlers = {  //event listeners
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler ,
      [NEW_REQUEST]: newRequestHandler ,
      [REFETCH_CHATS]: refetchChatHandler ,
      [ONLINE_USERS]:onlineUsersHandler
      }

    useSocketEvents(socket, eventHandlers) 
    useErrors([{isError,error}])

    return (
        <>
            <Title/>
            <Header/>

            <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor}/>

            {
              isLoading ? (<Skeleton/>):(
                <Drawer open={isMobile} onClose={handleMobileClose}>
                   <ChatLists
                         chats={data?.chats} chatID={chatID} 
                         handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert}
                         onlineUsers={onlineUsers}
                    />
                </Drawer>
              )
            }

            <Grid container sx={{ height: 'calc(100vh - 4rem)' }}>
                 <Grid item sm={4} height={"100%"} sx={{display:{xs:'none' , sm:'block'}}}>
                    {/* <ChatLists chats={sampleChats} chatID={chatID} 
                    newMessagesAlert={[{
                      chatID:chatID,count:4
                    }]}
                    onlineUsers={["1","2"]}
                    handleDeleteChat={handleDeleteChat}
                    /> */}
                    {
                      isLoading ? (<Skeleton/>):(
                        <ChatLists
                         chats={data?.chats} chatID={chatID} 
                         handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert}
                         onlineUsers={onlineUsers}
                        />
                      )
                    }
                 </Grid>
                 <Grid item xs={12} sm={8} height={"100%"} >
                     <WrappedComponent {...props} chatId={chatID} user={user}/>
                 </Grid>

                 {/* <Profile user={user}/> */}
                 {/* user profile */}
            </Grid>
        </>
    )
  }
}

export default AppLayout