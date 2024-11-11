import { FileOpen } from '@mui/icons-material'
import React from 'react'
import { transformImage } from '../../lib/features'

const RenderAttachment = ({file,url}) => {
  
    switch (file) {
        case 'video':
            return <video src={url} preload='none' controls/>

        case 'audio':
            return <audio src={url} preload='none' controls/>

        case 'image':
            return <img src={transformImage(url)} preload='none'  height={'200px'} width={'200px'} />
         
        default:
            return <FileOpen/>
    }
}

export default RenderAttachment