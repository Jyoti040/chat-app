import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/Layout/AppLayout';
import { Container, IconButton, Skeleton, Stack } from '@mui/material';
import { gray, orange } from '../constants/colors';
import { AttachFile, Send } from '@mui/icons-material';
import FileMenu from '../components/dialog/FileMenu';
// import { sampleMessages, user } from '../constants/sampleData';
import MessageComponent from '../components/Shared/MessageComponent';
import { getSocket } from '../socket';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hooks';
import {useInfiniteScrollTop} from "6pp"
import { useDispatch } from 'react-redux';
import { setIsFileMenu } from '../redux/reducers/misc';
import { removeMessagesAlert } from '../redux/reducers/chat.js';
import { TypingLoader } from '../components/Layout/Loaders.jsx';

const Chat = ({ chatId , user}) => {

  const containerRef = useRef(null);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

  const dispatch = useDispatch()

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [page, setPage] = useState(1)
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null)
  const [myselfTyping , setMyselfTyping] =useState(false)
  const [userTyping , setUserTyping] =useState(false)

  const socket = getSocket()
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId }) // if no chatid , then skip this
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page})
  const members = chatDetails.data.chat.members

  const {data:oldMessages , setData:setOldMessages} = useInfiniteScrollTop(  
    containerRef , oldMessagesChunk.data?.totalPages , page , setPage , oldMessagesChunk.data?.messages
  )

  const errors = [
    {isError : chatDetails.isError , error : chatDetails.error},
    {isError : oldMessagesChunk.isError , error : oldMessagesChunk.error},
  ]

  const allMessages = [...oldMessages , ...messages]

  const handleMessageChange = (e) =>{
    setMessage(e.target.value)
    
    if(!myselfTyping){
      socket.emit("start_typing",{members , chatId})
      myselfTyping(true)
    }

    if(typingTimeout.current) clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(()=>{
      socket.emit("stop_typing",{members , chatId})
      setMyselfTyping(false)
    },[2000])
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return

    socket.emit("new_message", { chatId, members, message }) //new message event emitted to server 
    setMessage("")
  }

  const handleFileOpen = (e) =>{
      dispatch(setIsFileMenu(true))
      setFileMenuAnchor(e.currentTarget)
  } 
  
  useEffect(()=>{
     dispatch(removeMessagesAlert(chatId))

     return ()=>{
      setMessage("")
      setMessages([])
      setOldMessages([])
      setPage(1)
     }
  },[chatId])

  useEffect(()=>{   //makes sure as new messages come , the scroller is always at bottom
    if(bottomRef.current) bottomRef.current.scrollIntoView({ behavior : "smooth"})
  },[messages])

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

  // const alertListener = useCallback((content) => {
  //   const messageForAlert = {
  //     content,
  //     _id:uuid(),
  //     sender : {
  //         _id : user._id,
  //         name : user.name
  //     },
  //     chat : chatId,
  //     createdAt: new Date().toISOString()
  //    }
  // }, [])

  // useEffect(()=>{   //one way of listeing to emit emitted from backend
  //   socket.on("new_message",newMessageHandler)

  //   return ()=>{
  //     socket.off("new_message",newMessageHandler)
  //   }
  // },[])

  const eventHandler = {
     "new_message": newMessageHandler  , 
     "start_typing":startTypingListener , 
     "stop_typing":stopTypingListener ,
    //  "alert":alertListener
    }

  useSocketEvents(socket, eventHandler)
  useErrors(errors)

  return chatDetails.isLoading ? (<Skeleton />) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={gray}
        height={"90%"}
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
          
          <IconButton sx={{ position: 'absolute', paddingTop: '15px', left: '0.5rem', marginRight: '2rem' }} onClick={handleFileOpen}>
            <AttachFile />
          </IconButton>

          <input placeholder='Type message here ... '
            style={{
              border: '1px solid black ', borderRadius: '40px', outline: 'none', backgroundColor: `${gray}`, width: '100%', marginLeft: '3rem', paddingLeft: '1rem'
            }}
            value={message} onChange={handleMessageChange}
          />
          <IconButton type='submit' sx={{
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