import React, { memo } from 'react'
import { StyledLink } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import {motion} from 'framer-motion'

const ChatItem = ({
  avatar=[] ,name , _id , groupChat = false , sameSender , isOnline , newMessageAlert , index=0 , handleDeleteChat
}) => {
  console.log("in chatitem",newMessageAlert)
  return (
    <StyledLink to={`/chat/${_id}`} onContextMenu={(e)=> handleDeleteChat(e,_id,groupChat)}>
        <motion.div 
          initial={{opacity:0,y:"-100%"}}
          whileInView={{opacity:1,y:0}}
          transition={{delay:index*0.1}}
        style={{
          display:'flex' , alignItems:'center' ,
          padding:'1rem' , position:'relative' , gap:'1rem',
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
              newMessageAlert.count>0 && <Typography>{newMessageAlert?.count} new messages</Typography>
            }
          </Stack>

          {
            isOnline && <Box />
          }
        </motion.div>
    </StyledLink>
  )
}

export default memo(ChatItem)