import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from './UserItem'

const NewGroup = () => {
  const [users, setUsers] = useState(sampleUsers)
  const [groupName, setGroupName] = useState("")
  const [members,setMembers] = useState(sampleUsers)
  const [selectedMembers,setSelectedMembers ]= useState([])

  const selectMemberHandler = (id) => {
    console.log('in select member handler ')
    // setMembers(prev=> prev.map((user)=>user._id===id ? {...user,isAdded:!user.isAdded} : user))

    setSelectedMembers(prev=> prev.includes(id) ? prev.filter((currID)=> currID !== id) : [...prev,id])
   
  }
  console.log(selectedMembers)

  const submitHandler = () => {
    console.log('in select member handler ')
  }

  return (
    <Dialog open>
      <Stack p={{ xs: '1rem', sm: '2rem' }} width={"25rem"}>
        <DialogTitle textAlign={"center"}>New Group</DialogTitle>

        <TextField label="Group Name" value={groupName} onChange={(e)=>setGroupName(e.target.value)}/>

        <Typography paddingTop={"1rem"} paddingBottom={"1rem"} variant='h6'>Members</Typography>

        {
          users.map((user) => (
            <UserItem
              user={user} key={user._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)}
            />
          ))
        }

        <Stack direction={"row"} sx={{display:'flex' , justifyContent:'space-evenly' , marginTop:'1rem'}}>
           <Button variant='text' color='error'>Cancel</Button>
           <Button variant='contained' onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup