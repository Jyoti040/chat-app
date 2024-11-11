import { Dialog, DialogActions, DialogTitle, Stack, Typography , Button} from '@mui/material'
import React , {useState} from 'react'
import { sampleUsers } from '../../constants/sampleData'
import UserItem from '../Shared/UserItem'

const AddMemberDialog = ({addMember , isLoadingAddMember , chatID}) => {

    const [members,setMembers] = useState(sampleUsers)
    const [selectedMembers,setSelectedMembers ]= useState([])
  
    const selectMemberHandler = (id) => {
      console.log('in select member handler ')
      // setMembers(prev=> prev.map((user)=>user._id===id ? {...user,isAdded:!user.isAdded} : user))
  
      setSelectedMembers(prev=> prev.includes(id) ? prev.filter((currID)=> currID !== id) : [...prev,id])
     
    }

    // const handleAddMember = (id)=>{

    // }

    const handleSubmitAddMember = () =>{
       handleClose()
    }

    const handleClose = () =>{
        setMembers([])
       setSelectedMembers([])
    }

  return (
   <Dialog open onClose={handleClose}>
       <Stack spacing={"2rem"} width={"25rem"} p={"2rem"}>
         <DialogTitle textAlign={"center"} variant='h5'>Add Members</DialogTitle>
         <Stack spacing={"1rem"}>
            {   members.length>0 ?
                members.map((user)=>(
                  <UserItem key={user._id} user={user}  handler={selectMemberHandler}  isAdded={selectedMembers.includes(user._id)}/>
                ))
                :
                <Typography textAlign={"center"}>No friends</Typography>
            }
         </Stack>
       
         <DialogActions>
                <Button onClick={handleClose} color='error' variant='outlined'>Cancel</Button>
                <Button  onClick={handleSubmitAddMember} variant='contained' disabled={isLoadingAddMember}>Submit Changes</Button>
            </DialogActions>
   
       </Stack>
   </Dialog>
  )
}

export default AddMemberDialog