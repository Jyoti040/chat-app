import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from './ChatItem'

const ChatLists = ({w="100%" , chats=[] , chatID , onlineUsers=[]  , newMessagesAlert=[{
    chatID:"",count : 0
}] , handleDeleteChat}) => {

  return (
    <Stack width={w} direction={"column"}>
       {
        chats?.map((chat,index)=>{
            const {avatar , _id , name , groupChat , members} = chat
            return <ChatItem/>
        })
       }
    </Stack>
  )
}

export default ChatLists