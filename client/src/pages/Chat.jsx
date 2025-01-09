import React, { useRef, useState } from 'react'
import AppLayout from '../components/Layout/AppLayout';
import { Container, IconButton, Skeleton, Stack } from '@mui/material';
import { gray, orange } from '../constants/colors';
import { AttachFile, Send } from '@mui/icons-material';
import FileMenu from '../components/dialog/FileMenu';
import { sampleMessages, user } from '../constants/sampleData';
import MessageComponent from '../components/Shared/MessageComponent';
import { getSocket } from '../socket';
import { useChatDetailsQuery } from '../redux/api/api';

const Chat = ({chatId}) => {

  const containerRef = useRef(null);
  const [message , setMessage] = useState("")

  const socket = getSocket()
  const chatDetails = useChatDetailsQuery({chatId , skip:!chatId}) // if no chatid , then skip this
  const members = chatDetails.data.chat.members

  const handleSubmit = (e)=>{
    e.preventDefault();

    if(!message.trim()) return

    socket.emit("new_message",{chatId,members,message}) //new message event emitted to server 
    setMessage("")
  }

  return chatDetails.isLoading ? (<Skeleton/>) :  (
    <>
     <Stack
     ref={containerRef}
     boxSizing={"border-box"}
     padding={"1rem"}
     spacing={"1rem"}
     bgcolor={gray}
     height={"90%"}
     sx={{
      overflowX:"hidden", overflowY:"auto"
     }}
     >

{
  sampleMessages.map((msg)=><MessageComponent message={msg} user={user}/>)
}
     </Stack>

     <form style={{height:"10%" , width:"100%" ,  paddingBottom:'0px' , marginBottom:'2px' , backgroundColor:'white' }}
       onSubmit={handleSubmit}
     >
       <Stack direction={"row"} height={"100%"} paddingTop={"1rem"}  position={"relative"} >
         <IconButton sx={{ position:'absolute'  , paddingTop:'15px' , left:'0.5rem' , marginRight:'2rem'}} >
           <AttachFile/>
         </IconButton>


<input placeholder='Type message here ... '
 style={{
  border:'1px solid black ' , borderRadius:'40px', outline:'none' , backgroundColor:`${gray}` , width:'100%'   ,  marginLeft:'3rem' , paddingLeft:'1rem'
}}
value={message} onChange={(e)=>setMessage(e.target.value)}
/>
         <IconButton type='submit' sx={{
          bgcolor:`${orange}`, color:'white', padding:'0.5rem' ,"&:hover":{ bgcolor : 'error.dark'} , margin:'0.5rem' 
         }}>
           <Send/>
         </IconButton>

       </Stack>
     </form>

     <FileMenu />
    </>
  )
}

export default AppLayout()(Chat);