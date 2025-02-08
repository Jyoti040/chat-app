import React, { memo } from 'react'
import { StyledLink } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import {motion} from 'framer-motion'
import { Link } from 'react-router-dom'

const ChatItem = ({
  avatar=[] ,name , _id , groupChat = false , sameSender , isOnline , newMessageAlert , index=0 , handleDeleteChat
}) => {
  console.log("in chatitem",newMessageAlert)

  const showNewMessageAlert = groupChat && !sameSender
  
  return (
    <Link to={`/chat/${_id}`} onContextMenu={(e)=> handleDeleteChat(e,_id,groupChat)}>
        <motion.div 
          initial={{opacity:0,y:"-100%"}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:index*0.1}}
        style={{
          display:'flex' , alignItems:'center' ,
          padding:'1rem' , position:'relative' , gap:'1rem',
          // marginLeft:'2rem',
          backgroundColor: newMessageAlert?'black':'unset' , 
          color: sameSender?'blue':'green' ,
          borderBottom: "1px solid #f0f0f0"
        }}>
          <AvatarCard avatar={avatar}/>
          <Stack>
            <Typography variant='h6' 
            // sx={{color:sameSender?'black':'inherit'}}
            >{name}</Typography>
            {
              newMessageAlert?.count>0 && showNewMessageAlert && <Typography>{newMessageAlert?.count} new messages</Typography>
            }
          </Stack>

          {
            isOnline && !groupChat && <Box 
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
            />
          }
        </motion.div>
    </Link>
  )
}

//export default memo(ChatItem)
export default ChatItem