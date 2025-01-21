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

 const isGroup =  selectedDeletedChat.groupChat

 const closeHandler = () => {
    dispatch(setIsDeleteMenu(false))
    deleteMenuAnchor.current=null
 }
    
 const leaveGroupHandler = () => {
   closeHandler()
   leaveGroup("Leaving group...",selectedDeletedChat.chatId)
 }

 const deleteChatHandler = () => {
   closeHandler()
   deleteChat("Deleting chat...",selectedDeletedChat.chatId)
 }

 useEffect(()=>{
   if(deleteChatData || leaveGroupData) navigate("/")
 },[deleteChatData,leaveGroupData])

  return (
    <Menu open={isDeleteMenu} 
    onClose={closeHandler} 
    anchorEl={deleteMenuAnchor.current} 
    anchorOrigin={{vertical:"bottom" , horizontal:"right"}}
    transformOrigin={{vertical:"center" , horizontal:"center"}}
    >
       <Stack
         sx={{
            width : "10rem" , padding :"0.5rem" , cursor:"pointer"
         }}
         direction={"row"} alignItems={"center"} spacing={"0.5rem"}
          onClick={isGroup?leaveGroupHandler:deleteChatHandler}
       >
         {
            isGroup?
            (<><ExitToApp>
               <Typography>Leave Group</Typography>
               </ExitToApp></>)
            :
            (<><DeleteOutline>
               <Typography>Delete Chat</Typography>
               </DeleteOutline></>)
         }
       </Stack>
    </Menu>
  )
}

export default DeleteChatMenu