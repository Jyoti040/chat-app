import React from 'react'
import Header from './Header'
import Title from '../Shared/Title'
import { Grid } from '@mui/material'
import ChatLists from '../Shared/ChatLists'
import { useParams } from 'react-router-dom'

const sampleChats=[
  {
    avatar : ["data:image/jpeg;base64,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"],
    name:"John Doe",
    _id:"1",
    groupchat:false,
    members:["1","2"]
  }
]

const AppLayout = () => (WrappedComponent)=> {  //HOC - Higher order component
  return (props)=>{

    const params = useParams()
    const chatID= params.chatID;

    const handleDeleteChat=(e,_id,groupchat)=>{
      e.preventDefault();
      console.log('in delete chat')
    }
    return (
        <>
            <Title/>
            <Header/>

            <Grid container sx={{ height: 'calc(100vh - 4rem)' }}>
                 <Grid item sm={4} height={"100%"} sx={{display:{xs:'none' , sm:'block'}}}>
                    <ChatLists chats={sampleChats} chatID={chatID} 
                    newMessagesAlert={[{
                      chatID:chatID,count:4
                    }]}
                    onlineUsers={["1","2"]}
                    handleDeleteChat={handleDeleteChat}
                    />
                 </Grid>
                 <Grid item xs={12} sm={8} height={"100%"} >
                     <WrappedComponent {...props}/>
                 </Grid>
            </Grid>
        </>
    )
  }
}

export default AppLayout