import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation, useErrors } from '../../hooks/hooks'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { setIsNotification } from '../../redux/reducers/misc'

const Notifications = () => {

  const {isError , error , isLoading , data} = useGetNotificationsQuery()
  const {isNotification}=useSelector((state)=>state.misc)
  const dispatch = useDispatch()

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation)

  const friendRequestHandler=async(_id,accept)=>{
    console.log('in notifications',_id,accept)
    dispatch(setIsNotification(false))
    await acceptRequest("Accepting friend request",{ requestId: _id , accept:accept})
    
    // try {
    //   const res=await acceptRequest("Accepting friend request",{ requestId: _id , accept})
    //   if(res.data?.success){
    //         toast.success(res.data.message)
    //   }else{
    //        toast.error(res.data?.error || "Something went wrong")
    //   }
    // } catch (error) {
    //   toast.error(error || "Something went wrong")
    // }
  }

  useErrors([{error , isError}])

 const notificationCloseHandler = ()=>{
    dispatch(setIsNotification(false))
  }
  
  return (
    <Dialog open={isNotification} onClose={notificationCloseHandler}>
      <Stack p={{ xs:'1rem' ,sm:'2rem'}} maxWidth={"25rem"}>
        <DialogTitle textAlign={"center"}>Notifications</DialogTitle>
        {
          isLoading ? (<Skeleton/>):( 
            data?.allRequests?.length >0 ?
             data?.allRequests?.map((item)=>{
              console.log("in notifications ",item)
              return (
                <NotificationIem sender={item.sender} _id={item._id} handler={friendRequestHandler} key={item._id}/>
              )
             })
            :
            <Typography textAlign={"center"}>No New Notifications</Typography>
          )
        }
      </Stack>
    </Dialog>
  )
}

const NotificationIem=({sender , _id , handler})=>{
  console.log("in notification item",sender,_id,handler)
   const {name , avatar} = sender
     return (
      <ListItem>
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} >
          <Avatar src={avatar}/>

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
            <Button onClick={()=>handler(_id,true)}>Accept</Button>
            <Button onClick={()=>handler(_id,false)} color='error'>Reject</Button>
          </Stack>

      </Stack>
  </ListItem>
     )
}

export default Notifications