import React, { memo } from 'react'
import { StyledLink } from '../styles/StyledComponents'
import { Box, Stack, Typography } from '@mui/material'

const ChatItem = ({
  avatar=[] ,name , _id , groupChat = false , sameSender , isOnline , newMessageAlert , index=0 , handleDeleteChatOpen
}) => {
  return (
    <StyledLink to={`/chat/${_id}`} onContextMenu={(e)=> handleDeleteChatOpen(e,_id,groupChat)}>
        <div style={{
          display:'flex' , alignItems:'center' ,
          padding:'1rem' , position:'relative' , gap:'1rem',
          backgroundColor: newMessage?'black':'unset' , 
          color: sameSender?'white':'black' ,
          borderBottom: "1px solid #f0f0f0"
        }}>
          {/* Avatara card */}
          <Stack>
            <Typography>{name}</Typography>
            {
              newMessageAlert && <Typography>{newMessageAlert?.count} new messages</Typography>
            }
          </Stack>

          {
            isOnline && <Box/>
          }
        </div>
    </StyledLink>
  )
}

export default memo(ChatItem)