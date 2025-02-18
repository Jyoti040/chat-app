import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setIsUploadingLoader } from '../../redux/reducers/misc'
import { AudioFile, Image, UploadFile, VideoFile } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../../redux/api/api'

const FileMenu = ({anchorEl , chatId}) => {

  const {isFileMenu} = useSelector((state)=>state.misc)
  const dispatch = useDispatch()

  const imageRef = useRef(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const fileRef = useRef(null)

  const selectImage = () => imageRef.current?.click()
  const selectAudio = () => audioRef.current?.click()
  const selectVideo = () => videoRef.current?.click()
  const selectFile = () =>  fileRef.current?.click()

  const [sendAttachments] = useSendAttachmentsMutation()

  const closeFileMenu = ()=>{
     dispatch(setIsFileMenu(false))
  }

  const handleFileChange = async (e, key) => {
    const files = Array.from(e.target.files); 

    if (files.length <= 0) return;
    if (files.length > 5) {
        toast.error(`You can't upload more than 5 ${key} at a time`);
        return;
    }

    dispatch(setIsUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key} ...`);
    closeFileMenu();

    try {
        const myForm = new FormData();
        myForm.append("chatId", chatId);
        files.forEach((file) => myForm.append("files", file)); 

        console.log("Uploading FormData:", myForm);

        const res = await sendAttachments(myForm);

        if (res.data) {
            toast.success(`${key} sent successfully`, { id: toastId });
        } else {
            toast.error(`Failed to send ${key}`, { id: toastId });
        }
    } catch (error) {
        toast.error(error.message || "File upload failed", { id: toastId });
    } finally {
        dispatch(setIsUploadingLoader(false));
    }
};


  return (
    <Menu anchorEl={anchorEl} open={isFileMenu} onClose={closeFileMenu}>
        <div style={{width:'10rem'}} >
           <MenuList>
            <MenuItem onClick={selectImage}>
              <Tooltip title="Image">
                <Image/>
              </Tooltip>
              <ListItemText style={{ marginLeft : "0.5rem"}}>
                Image
              </ListItemText>
              <input type='file' accept='image/png , image/jpeg , image/jpg , image/gif' style={{display:"none"}} onChange={(e)=>handleFileChange(e,"Images")} ref={imageRef} multiple/>
            </MenuItem>
               
            <MenuItem onClick={selectAudio}>
              <Tooltip title="Audio">
                <AudioFile/>
              </Tooltip>
              <ListItemText style={{ marginLeft : "0.5rem"}}>
                Audio
              </ListItemText>
              <input type='file' accept='audio/mpeg ,audio/wav' style={{display:"none"}} onChange={(e)=>handleFileChange(e,"Audios")} ref={audioRef} multiple/>
            </MenuItem>
                    
           <MenuItem onClick={selectVideo}>
              <Tooltip title="Video">
                <VideoFile/>
              </Tooltip>
              <ListItemText style={{ marginLeft : "0.5rem"}}>
                Video
              </ListItemText>
              <input type='file' accept='video/mp4 , video/webm , video/ogg' style={{display:"none"}} onChange={(e)=>handleFileChange(e,"Videos")} ref={videoRef} multiple/>
            </MenuItem>
          
            <MenuItem onClick={selectFile}>
              <Tooltip title="File">
                <UploadFile/>
              </Tooltip>
              <ListItemText style={{ marginLeft : "0.5rem"}}>
                File
              </ListItemText>
              <input type='file' accept='*' style={{display:"none"}} onChange={(e)=>handleFileChange(e,"Files")} ref={fileRef} multiple/>
            </MenuItem>
           </MenuList>
        </div>
    </Menu>
  )
}

export default FileMenu