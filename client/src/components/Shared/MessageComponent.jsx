import { Typography , Box } from '@mui/material'
import React, { memo } from 'react'
import { green } from '../../constants/colors'
import moment from 'moment'
import { fileFormat } from '../../lib/features'
import RenderAttachment from './RenderAttachment'

const MessageComponent = ({message,user}) => {
 const { sender , content , attachments =[] , createdAt} = message

 const sameSender = sender?._id === user?._id

 const timeAgo = moment(createdAt).fromNow()

  return (
    <div
    style={{
        alignSelf:sameSender?'flex-end':'flex-start',
        backgroundColor:'white',
        color:'black' ,
        padding:'0.5rem',
        borderRadius:'5px',
        width:'fit-content'
    }}
    >
        {
            !sameSender && <Typography variant='caption' fontWeight={'600'} color={`${green}`}>{sender.name}</Typography>
        }
        {
            content && <Typography>{content}</Typography>
        }

{
    attachments.length>0 && attachments.map((attachment , index)=>{

        const url = attachment.url;
        const file=fileFormat(url);

        return(
            <Box key={index}>
                <a href={url} target='_blank' download style={{ color:'black'}}>
                  <RenderAttachment file={file} url={url}/>
                </a>
            </Box>
        )
    })
}
<Typography color='text.secondary' variant='caption'>{timeAgo}</Typography>

    </div>
  )
}

export default memo(MessageComponent)