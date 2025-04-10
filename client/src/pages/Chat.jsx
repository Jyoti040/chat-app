import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/Layout/AppLayout';
import { Container, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { gray, orange } from '../constants/colors';
import { AttachFile, Send } from '@mui/icons-material';
import FileMenu from '../components/dialog/FileMenu';
// import { sampleMessages, user } from '../constants/sampleData';
import MessageComponent from '../components/Shared/MessageComponent';
import { getSocket } from '../socket';
import { useChatDetailsQuery, useGetMessagesQuery, useLazyChatDetailsQuery } from '../redux/api/api';
import { useAsyncMutation, useErrors, useSocketEvents } from '../hooks/hooks';
import {useInfiniteScrollTop} from "6pp"
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeMessagesAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/Layout/Loaders.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from '../constants/config.js';
import AvatarCard from '../components/Shared/AvatarCard.jsx';
//import { populate } from '../../../server/models/chat.js';

const Chat = ({ chatId , user}) => {

  const containerRef = useRef(null);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [page, setPage] = useState(1)
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null)
  const [myselfTyping , setMyselfTyping] =useState(false)
  const [userTyping , setUserTyping] =useState(false)

  console.log("in chats js ",chatId , user)

  const {newMessagesAlert} =useSelector((state)=>state.chat)

  const socket = getSocket()
  //const [getChatDetails , isLoadingChatDetails] = useAsyncMutation(useChatDetailsQuery)
  const {isError , error , isLoading , data} = useChatDetailsQuery({chatId:chatId,populate:false}) // if no chatid , then skip this
 // const {isError , error , isLoading , data} = useLazyChatDetailsQuery({chatId:numericChatId,populate:false}) // if no chatid , then skip this
 
//  console.log("in chat ",data,chatId,numericChatId,user)
  const chatDetails=data
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page})
  const members = chatDetails?.chat?.members

  const {data:oldMessages , setData:setOldMessages} = useInfiniteScrollTop(  
    containerRef , oldMessagesChunk.data?.totalPages , page , setPage , oldMessagesChunk.data?.messages
  )

  const errors = [
    {isError : isError , error : error},
    {isError : oldMessagesChunk.isError , error : oldMessagesChunk.error},
  ]

  const {avatar , name } = location.state
  // const allMessages = [  ...oldMessages , ...messages ]
 // console.log("in chat all msgs ",allMessages)

 useEffect(()=>{
  console.log("before remove msg alert")
  dispatch(removeMessagesAlert(chatId))
  console.log("after remove msg alert")
  socket.emit(CHAT_JOINED,{userId : user._id , members})

   return ()=>{
    setMessage("")
    setMessages([])
    setOldMessages([])
    setPage(1)
    socket.emit(CHAT_LEAVED,{userId : user._id , members})
   }
},[chatId])


  const handleMessageChange = (e) =>{
    setMessage(e.target.value)
    console.log("in handleMessageChange ",message)
    if(!myselfTyping){
      socket.emit(START_TYPING,{members , chatId})
      setMyselfTyping(true)
    }

    if(typingTimeout.current) clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(()=>{
      socket.emit(STOP_TYPING,{members , chatId})
      setMyselfTyping(false)
    },[2000])
  }

  const handleSubmit = (e) => {
    console.log("in handle submit ",message)
    e.preventDefault();

    if (!message.trim()) return

    socket.emit(NEW_MESSAGE, { chatId, members, message }) //new message event emitted to server 
    setMessage("")
  }

  const handleFileOpen = (e) =>{
      dispatch(setIsFileMenu(true))
      setFileMenuAnchor(e.currentTarget)
  } 
  
  useEffect(()=>{   //makes sure as new messages come , the scroller is always at bottom
    if(bottomRef.current) bottomRef.current.scrollIntoView({ behavior : "smooth"})
  },[messages])

  useEffect(()=>{
    if(isError) return navigate("/")
 },[isError])

  const newMessageHandler = useCallback((data) => {
    if(data.chatId !== chatId) return 
    setMessages(prev => [...prev, data.message])
  }, [chatId])

  const startTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return 
    setUserTyping(true)
    console.log("in start typing listener ",data)
  }, [chatId])

  const stopTypingListener = useCallback((data) => {
    if(data.chatId !== chatId) return 
    setUserTyping(false)
    console.log("in stop typing listener ",data)
  }, [chatId])

  // const alertListener = useCallback((data) => {
  //   if(data.chatId !== chatId) return;
  //   console.log("in alert listener",data)
  //   const messageForAlert = {
  //     content:data.message,
  //     _id:v4(),
  //     sender : {
  //         _id : "mkscwkrnxsaplpl",
  //         name : "Admin"
  //     },
  //     chat : chatId,
  //     createdAt: new Date().toISOString()
  //    }
  //    setMessages((prev)=>[...prev,messageForAlert])
  // }, [chatId])

  // useEffect(()=>{   //one way of listeing to emit emitted from backend
  //   socket.on("new_message",newMessageHandler)

  //   return ()=>{
  //     socket.off("new_message",newMessageHandler)
  //   }
  // },[])

  const eventHandler = {
     [NEW_MESSAGE]: newMessageHandler  , 
     [START_TYPING]:startTypingListener , 
     [STOP_TYPING]:stopTypingListener ,
    //  [NEW_MESSAGE_ALERT]:alertListener
    }

  useSocketEvents(socket, eventHandler)
  useErrors(errors)

  oldMessages.reverse()
  const allMessages = [  ...oldMessages , ...messages ]
  console.log("in chat all msgs ",allMessages)

  return isLoading ? (<Skeleton />) : (
    <>
      {/* <Stack
      boxSizing={"border-box"}
      padding={"1rem"}
      spacing={"1rem"}
      bgcolor={"lightGray"}
      direction={"row"}
      sx={{ position:'sticky'}}
      >
         <AvatarCard avatar={avatar} />
         <Typography variant="h6" sx={{ color: 'lightBlack'}}>
            {name}
          </Typography>
      </Stack> */}

      <Paper
       sx={{ position:'sticky' , display:'flex' , padding:'1rem' , zIndex:'100' , bgcolor:'lightgray'}}
      >
      <AvatarCard avatar={avatar} />
         <Typography variant="h5" sx={{ color: 'black'}}>
            {name}
          </Typography>
      </Paper>

      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={gray}
        height={"80%"}
        sx={{
          overflowX: "hidden", overflowY: "auto"
        }}
      >

        {
          allMessages.map((msg) => <MessageComponent message={msg} user={user} key={msg._id}/>)
        }

        {
          userTyping && <TypingLoader/>
        }

        <div ref={bottomRef}/>

      </Stack>

      <form style={{ height: "10%", width: "100%", paddingBottom: '0px', marginBottom: '2px', backgroundColor: 'white' }}
        onSubmit={handleSubmit}
      >
        <Stack direction={"row"} height={"100%"} paddingTop={"1rem"} position={"relative"} >
          
          <IconButton type='button' title='attach file' aria-label='attach file' sx={{ position: 'absolute', paddingTop: '15px', left: '0.5rem', marginRight: '2rem' , paddingBottom:"1rem" }} onClick={handleFileOpen}>
            <AttachFile />
          </IconButton>

          <input placeholder='Type message here ... '
            style={{
              border: '1px solid black ', borderRadius: '40px', outline: 'none', backgroundColor: `${gray}`, width: '100%', marginLeft: '3rem', paddingLeft: '1rem'
            }}
            value={message} onChange={handleMessageChange}
          />
          <IconButton aria-label='send message' title='send message' type='submit' sx={{
            bgcolor: `${orange}`, color: 'white', padding: '0.5rem', "&:hover": { bgcolor: 'error.dark' }, margin: '0.5rem' 
          }}>
            <Send />
          </IconButton>

        </Stack>
      </form>
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId}/>
    </>
  )
}

export default AppLayout()(Chat);