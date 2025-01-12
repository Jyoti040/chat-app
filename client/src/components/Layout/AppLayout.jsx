import React, { useCallback, useEffect } from 'react'
import Header from './Header'
import Title from '../Shared/Title'
import { Drawer, Grid, Skeleton } from '@mui/material'
import ChatLists from '../specific/ChatLists'
import { useParams } from 'react-router-dom'
import { useMyChatsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsMobile } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'
import { useErrors, useSocketEvents } from '../../hooks/hooks'
import Profile from '../specific/Profile'
import { getSocket } from '../../socket'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat.js'
import { getOrSaveFromLocalStorage } from '../../lib/features.js'

const AppLayout = () => (WrappedComponent)=> {  //HOC - Higher order component
  return (props)=>{

    const params = useParams()
    const {isMobile} = useSelector((state)=>state.misc)
    const {user} = useSelector((state)=>state.auth)
    const {newMessageAlert} = useSelector((state)=>state.chat)
    const dispatch = useDispatch()
    const chatID= params.chatID;

    const socket = getSocket()

    const {isLoading , data , isError , error , refetch} = useMyChatsQuery("")

    useEffect(()=>{
      getOrSaveFromLocalStorage({key:"new_message_alert",value:newMessageAlert})
    },[newMessageAlert])

    const handleDeleteChat=(e,_id,groupchat)=>{
      e.preventDefault();
      console.log('in delete chat')
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

    const eventHandlers = { "new_message_alert": newMessageAlertHandler ,  "new_request": newRequestHandler }

    useSocketEvents(socket, eventHandlers) 
    useErrors([{isError,error}])

    return (
        <>
            <Title/>
            <Header/>

            {
              isLoading ? (<Skeleton/>):(
                <Drawer open={isMobile} onClose={handleMobileClose}>
                   <ChatLists
                         chats={data?.chats} chatID={chatID} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessageAlert}
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
                         chats={data?.chats} chatID={chatID} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessageAlert}
                        />
                      )
                    }
                 </Grid>
                 <Grid item xs={12} sm={8} height={"100%"} >
                     <WrappedComponent {...props} chatId={chatID} user={user}/>
                 </Grid>

                 <Profile user={user}/>
                 {/* user profile */}
            </Grid>
        </>
    )
  }
}

export default AppLayout