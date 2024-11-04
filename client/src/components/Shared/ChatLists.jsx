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

            const newMessageAlert = newMessagesAlert.find(({chatID})=>chatID===_id)

            const isOnline = members?.some((member)=>onlineUsers.includes(_id))
            console.log('in chat list ',isOnline)

            return <ChatItem index={index}
            newMessageAlert={newMessageAlert} isOnline={isOnline} avatar={avatar} name={name} _id={_id} key={_id} groupChat={groupChat} sameSender={chatID===_id}
            handleDeleteChat={handleDeleteChat}
            />
        })
       }
    </Stack>
  )
}

export default ChatLists