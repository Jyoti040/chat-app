import { Dialog , Stack , DialogTitle, Typography ,ListItem , Avatar, Button, Skeleton} from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../../constants/sampleData'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hooks'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'

const Notifications = () => {

  const {isError , error , isLoading , data} = useGetNotificationsQuery()
  const {isNotification}=useSelector((state)=>state.misc)
  const dispatch = useDispatch()

  const [acceptRequest] = useAcceptFriendRequestMutation()

  const friendRequestHandler=async({_id,accept})=>{
    console.log('in notifications')
    dispatch(setIsNotification(false))
    try {
      const res=await acceptRequest({ requestId: _id , accept})
      if(res.data?.success){
            toast.success(res.data.message)
      }else{
           toast.error(res.data?.error || "Something went wrong")
      }
    } catch (error) {
      toast.error(error || "Something went wrong")
    }
  }

  useErrors([{error , isError}])

  notificationCloseHandler = ()=>{
    dispatch(setIsNotification(false))
  }
  
  return (
    <Dialog open={isNotification} onClose={notificationCloseHandler}>
      <Stack p={{ xs:'1rem' ,sm:'2rem'}} maxWidth={"25rem"}>
        <DialogTitle textAlign={"center"}>Notifications</DialogTitle>
        {
          isLoading ? (<Skeleton/>):( 
            data?.allRequests?.length >0 ?
             data?.allRequests?.map((item)=>(
              <NotificationIem sender={item.sender} _id={item._id} handler={friendRequestHandler} key={item._id}/>
            ))
            :
            <Typography textAlign={"center"}>No New Notifications</Typography>
          )
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