import { Stack } from '@mui/material'
import React from 'react'
import ChatItem from '../Shared/ChatItem'

const ChatLists = ({w="100%" , chats=[] , chatID , onlineUsers=[]  , newMessagesAlert=[{
    chatID:"",count : 0
}] , handleDeleteChat}) => {

  return (
    <Stack width={w} direction={"column"}>
       {
        chats?.map((chat,index)=>{
          console.log("in chat lists chat -",chat)
            const {avatar , _id , name , groupChat , members} = chat

            const newMessageAlert = newMessagesAlert.find(({chatId})=>chatId===_id)

            const isOnline = members?.some((member)=>onlineUsers.includes(member))
            console.log('in chat list ',newMessageAlert)

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