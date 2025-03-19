import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { DeleteOutline, ExitToApp } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hooks'
import { useDeleteChatMutation } from '../../redux/api/api'

const DeleteChatMenu = ({dispatch , deleteMenuAnchor}) => {

 const navigate = useNavigate()  
  
 const {isDeleteMenu , selectedDeletedChat} = useSelector((state)=>state.misc) 
 const [deleteChat,_,deleteChatData] = useAsyncMutation(useDeleteChatMutation)
 const [leaveGroup,__,leaveGroupData] = useAsyncMutation(useDeleteChatMutation)

 const isGroup =  selectedDeletedChat.groupchat

 console.log("inn  DeleteChatMenu ",selectedDeletedChat)
 
 const closeHandler = () => {
    dispatch(setIsDeleteMenu(false))
    deleteMenuAnchor=null
 }
    
 const leaveGroupHandler = () => {
   closeHandler()
   leaveGroup("Leaving group...",{chatId:selectedDeletedChat.chatId})
 }

 const deleteChatHandler = () => {
   closeHandler()
   console.log("in delete chat handler ",typeof selectedDeletedChat.chatId)
   deleteChat("Deleting chat...",{chatId:selectedDeletedChat.chatId})
 }

 useEffect(()=>{
   if(deleteChatData || leaveGroupData) navigate("/")
 },[deleteChatData,leaveGroupData])

  return (
    <Menu open={isDeleteMenu} 
    onClose={closeHandler} 
    anchorEl={deleteMenuAnchor} 
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "center",
      horizontal: "center",
    }} 
    >
       <Stack
         sx={{
            width : "11rem" , padding :"0.5rem" , cursor:"pointer"
         }}
         direction={"row"} alignItems={"center"} spacing={"0.5rem"}
          onClick={isGroup?leaveGroupHandler:deleteChatHandler}
       >
         {
            isGroup?
            (
              <>
              <ExitToApp/>
              <Typography  fontSize={"16px"}>Leave Group</Typography>
              </>
              
            )
            :
            (<><DeleteOutline />
               <Typography  fontSize={"16px"}>Delete Chat</Typography>
            </>)
         }
       </Stack>
    </Menu>
  )
}

export default DeleteChatMenu