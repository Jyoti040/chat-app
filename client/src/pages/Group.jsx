import { KeyboardBackspace, KeyboardBackspaceRounded, Menu } from '@mui/icons-material'
import { Grid2 , Grid, Tooltip, IconButton, Drawer, Stack, Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import { gray, metalBlack } from '../constants/colors'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AvatarCard from '../components/Shared/AvatarCard'

// const chatID='abcd' //sample

const Group = () => {
  const [isMobileOpen , setIsMobileOpen] = useState(false)
  const [groupName , setGroupName] = useState("")
  const [groupNameUpdated , setGroupNameUpdated ] = useState("")
  const [isEditing , setIsEditing ] = useState(false)

  const navigate = useNavigate()

  const chatID = useSearchParams()[0].get('group')

  const navigateBack = ()=>{
    navigate('/')
  }

  const handleMobile = ()=>{
     setIsMobileOpen((prev)=> !prev)
  }

  const handleClose = ()=>{
    setIsMobileOpen(false)
  }

  const handleUpdateGrroupName = ()=>{
    setIsEditing(false)
  }
  return (
    <Grid container height={"100vh"}>
      <Grid item
      sx={{
        display:{
          xs:'none' , sm:'block'
        }
      }}  sm={4} bgcolor={'bisque'}
      >
        <GroupLists />
      </Grid>

      <Grid item xs={12} sm={8}
      sx={{
        display:'flex' , flexDirection:'column' , alignItems:'center' , position:'relative'
      }}
      >
        
        <Tooltip title='back'>
           <IconButton sx={{
            backgroundColor:`${metalBlack}` , color:'white' , position:'absolute' , top:'2rem' , left :'2rem' , ':hover':{ bgcolor:'rgba(0,0,0,0.5)'}
           }} onClick={navigateBack}>
             <KeyboardBackspaceRounded/>
           </IconButton>
        </Tooltip>

        <IconButton sx={{
          position:'fixed' ,  top:'2rem' , right :'2rem' , display:{ xs:'block' , sm:'none'} ,   ':hover':{ bgcolor:gray}
        }} onClick={handleMobile}>
           <Menu/>
        </IconButton>

        

      </Grid>

<Drawer sx={{
  display:{ xs:'block' , sm:'none'}
}} open={isMobileOpen} onClose={handleClose}>
 <GroupLists w={'50vw'}/>
</Drawer>
    </Grid>
  )
}

const GroupLists = ({w="100%",myGroups=[],chatID}) =>{
  return(
    <Stack width={w}>
      {
        myGroups.length>0 ?
         myGroups.map((group)=>{
          <GroupListItem group={group} key={group._id} chatID={chatID}/>
         })
          : 
          <Typography variant='h3' textAlign={'center'}>No groups to display</Typography>
      }
    </Stack>
  )
}

const GroupListItem = memo(({group , chatID}) =>{
  const {name , avatar , _id} = group
 
  return (
   <Link to={`?group=${_id}`} onClick={e=>{
    if(_id === chatID) e.preventDefault();
   }}>
     <Stack direction={'row'} spacing={'1rem'} alignItems={'center'}>
        <AvatarCard avatar={avatar}/>
        <Typography>{name}</Typography>
     </Stack>
   </Link>
  )
 })

export default Group