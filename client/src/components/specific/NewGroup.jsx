import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from './UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hooks'
import { setIsNewGroup } from '../../redux/reducers/misc'
import toast from 'react-hot-toast'

const NewGroup = () => {
 
  const [groupName, setGroupName] = useState("")
  const [selectedMembers,setSelectedMembers ]= useState([])

  const dispatch = useDispatch()

  const {isNewGroup} = useSelector(state=>state.misc)

  const {isError , error , isLoading , data} = useAvailableFriendsQuery()

  const [newGroup , isLoadingNewGroup ] = useAsyncMutation(useNewGroupMutation)

  const errors = [
    {isError , error }
  ]

  useErrors(errors)

  const selectMemberHandler = (id) => {
    console.log('in select member handler ')
    // setMembers(prev=> prev.map((user)=>user._id===id ? {...user,isAdded:!user.isAdded} : user))

    setSelectedMembers(prev=> prev.includes(id) ? prev.filter((currID)=> currID !== id) : [...prev,id])
   
  }

  console.log(selectedMembers)

  const submitHandler = () => {
    console.log('in select member handler ')

    if(groupName.length<1) return toast.error("Group name is required")
    if(selectedMembers.length<2) return toast.error("Group must have atleast 3 members")

    newGroup("Creating new group ... ",{name : groupName , members:selectedMembers})

    closeHandler()
  }

  const closeHandler = () => {
    dispatch(setIsNewGroup(false))
  }

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: '1rem', sm: '2rem' }} width={"25rem"}>
        <DialogTitle textAlign={"center"}>New Group</DialogTitle>

        <TextField label="Group Name" value={groupName} onChange={(e)=>setGroupName(e.target.value)}/>

        <Typography paddingTop={"1rem"} paddingBottom={"1rem"} variant='h6'>Members</Typography>

        { isLoading ? <Skeleton/> :
          data?.friends?.map((user) => (
            <UserItem
              user={user} key={user._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)}
            />
          ))
        }

        <Stack direction={"row"} sx={{display:'flex' , justifyContent:'space-evenly' , marginTop:'1rem'}}>
           <Button variant='text' color='error' onClick={closeHandler}>Cancel</Button>
           <Button variant='contained' onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup