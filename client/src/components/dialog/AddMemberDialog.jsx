import { Dialog, DialogActions, DialogTitle, Stack, Typography, Button, Skeleton } from '@mui/material'
import React, { useState } from 'react'
import UserItem from '../Shared/UserItem'
import { useAsyncMutation, useErrors } from '../../hooks/hooks'
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../../redux/reducers/misc'

const AddMemberDialog = ({ chatId }) => {

  const [selectedMembers, setSelectedMembers] = useState([])

  const dispatch = useDispatch()
  const { isAddMember } = useSelector((state) => state.misc)

  const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMemberMutation)
  const { isError, error, isLoading, data } = useAvailableFriendsQuery(chatId)

  const selectMemberHandler = (id) => {
    console.log('in select member handler ')
    // setMembers(prev=> prev.map((user)=>user._id===id ? {...user,isAdded:!user.isAdded} : user))

    setSelectedMembers(prev => prev.includes(id) ? prev.filter((currID) => currID !== id) : [...prev, id])
  }

  // const handleAddMember = (id)=>{
  // }

  const handleSubmitAddMember = () => {
    handleClose()
    addMembers("Adding group members...", { chatId, members: selectedMembers })
  }

  const handleClose = () => {
    //   setMembers([])
    setSelectedMembers([])
    dispatch(setIsAddMember(false))
  }

  useErrors([{ error, isError }])

  return (
    <Dialog open={isAddMember} onClose={handleClose}>
      <Stack spacing={"2rem"} width={"25rem"} p={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h5'>Add Members</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? <Skeleton /> :
            data?.friends?.length > 0 ?
              data?.friends?.map((user) => (
                <UserItem key={user._id} user={user} handler={selectMemberHandler} isAdded={selectedMembers.includes(user._id)} />
              ))
              :
              <Typography textAlign={"center"}>No friends</Typography>
          }
        </Stack>

        <DialogActions>
          <Button onClick={handleClose} color='error' variant='outlined'>Cancel</Button>
          <Button onClick={handleSubmitAddMember} variant='contained' disabled={isLoadingAddMembers}>Submit Changes</Button>
        </DialogActions>
      </Stack>
    </Dialog>
  )
}

export default AddMemberDialog