import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React , {useEffect, useState} from 'react'
import {Search as SearchIcon} from '@mui/icons-material'
import UserItem from '../Shared/UserItem'
import { sampleUsers } from '../../constants/sampleData'
import { useDispatch, useSelector } from 'react-redux'
import { setIsSearch } from '../../redux/reducers/misc'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api'
import toast from 'react-hot-toast'
import { useAsyncMutation } from '../../hooks/hooks'

const Search = () => {

  const [searchValue , setSearchValue] = useState("")
  const [users,setUsers] = useState([])
  const {isSearch} = useSelector((state)=>state.misc)
   const dispatch = useDispatch()
   const [searchUser] = useLazySearchUserQuery("")
   const [sendFriendRequest , isLoadingFriendRequest ,]= useAsyncMutation(useSendFriendRequestMutation)
  // const [sendFriendRequest] = useSendFriendRequestMutation() //trigger , function - sendFriendRequest , can be given any other name as well

 // const isLoadingFriendRequest=false;

  const addFriendHandler=async(id)=>{
    // try {
    //   console.log('in add friend handler')
    //   const res=await sendFriendRequest({userId:id})
    //   if(res.data){
    //     toast.success("Friend request sent")
    //   }else{
    //     toast.error(res?.error?.data?.message || "Something went wrong while sending friend request")
    //   }
    // } catch (error) {
    //   console.log("in send friend request ",error)
    //   toast.error("Something went wrong while sending friend request")
    // }

   await sendFriendRequest("Sending friend request ",{userId:id})
  }

  const searchCloseHandler=()=>{
    useDispatch(setIsSearch(false))
  }

  useEffect(()=>{

    const timeOutId=setTimeout(()=>{
      console.log('in search user ',searchValue)
      searchUser(searchValue)
      .then(({data})=>setUsers(data.users))
      .catch((err)=>console.log("in search user ",err))
    },1000)

    return ()=>{
      clearTimeout(timeOutId)
    }
  },[searchValue])

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler} >
        <Stack width={"25rem"} direction={"column"} p={"2rem"} >
          <DialogTitle textAlign={"center"}>
            Find People
          </DialogTitle>

          <TextField 
           label="" variant='outlined' size='small'
           value={searchValue} onChange={(e)=>e.target.value}
           InputProps={{
            startAdornment:(
              <InputAdornment position='start'>
                <SearchIcon/>
              </InputAdornment>
            )
           }}
          />
        </Stack>

        <List>
          {
            users.map((user)=>(
             <UserItem
              user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingFriendRequest}
             />
            ))
          }
        </List>
    </Dialog>
  )
}

export default Search