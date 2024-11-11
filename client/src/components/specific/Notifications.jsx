import { Dialog , Stack , DialogTitle, Typography ,ListItem , Avatar, Button} from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../../constants/sampleData'

const Notifications = () => {

  const friendRequestHandler=({_id,accept})=>{
    console.log('in notifications')
  }
  return (
    <Dialog open>
      <Stack p={{ xs:'1rem' ,sm:'2rem'}} maxWidth={"25rem"}>
        <DialogTitle textAlign={"center"}>Notifications</DialogTitle>

        {
          sampleNotifications.length >0 ? sampleNotifications.map((item)=>(
            <NotificationIem sender={item.sender} _id={item._id} handler={friendRequestHandler} key={item._id}/>
          ))
          :
          <Typography textAlign={"center"}>No New Notifications</Typography>
        }
      </Stack>
    </Dialog>
  )
}

const NotificationIem=({sender , _id , handler})=>{
   const {name , avatar} = sender
     return (
      <ListItem>
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} >
          <Avatar/>

          <Typography
          variant='body1' 
          sx={{
              flexGrow:'1',
              display:'-webkit-box',
              WebkitLineClamp:'1',
              WebkitBoxOrient:'vertical',
              overflow:"hidden",
              textOverflow:"ellipsis",
              width:"100%"
          }}
          >{`${name} sent you a friend request`}</Typography>

          <Stack direction={{xs:'column' , md:'row'}}>
            <Button onClick={()=>handler(_id,accept=true)}>Accept</Button>
            <Button onClick={()=>handler(_id,accept=false)} color='error'>Reject</Button>
          </Stack>

      </Stack>
  </ListItem>
     )
}

export default Notifications