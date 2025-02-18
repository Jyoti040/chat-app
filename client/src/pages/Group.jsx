import { Add, Delete, Done, Edit, KeyboardBackspace, KeyboardBackspaceRounded, Menu } from '@mui/icons-material'
import { Grid2, Grid, Tooltip, IconButton, Drawer, Stack, Typography, TextField, Container, Button, Backdrop, CircularProgress } from '@mui/material'
import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import { gray, metalBlack } from '../constants/colors'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AvatarCard from '../components/Shared/AvatarCard'
import { sampleChats, sampleUsers } from '../constants/sampleData'
import UserItem from '../components/Shared/UserItem'
import { useAddGroupMemberMutation, useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hooks'
import { LoaderLayout } from '../components/Layout/Loaders'
import { useDispatch, useSelector } from 'react-redux'
import { setIsAddMember } from '../redux/reducers/misc'
//import { StyledLink } from '../styles/StyledComponents'

// const chatID='abcd' //sample
const ConfirmDeleteDialog = lazy(() => import('../components/dialog/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialog/AddMemberDialog'))

// const isAddMember = false;  temp var to show add members option 

const Group = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [groupName, setGroupName] = useState("Test Name")
  const [groupNameUpdated, setGroupNameUpdated] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [members, setMembers] = useState([])

  const navigate = useNavigate()
  let chatID = useSearchParams()[0].get('group')
  const dispatch = useDispatch()

  const {isAddMember} =useSelector((state)=>state.misc)

  const myGroups = useMyGroupsQuery("")
  const groupDetails = useChatDetailsQuery({chatId : chatID , populate : true},{skip:!chatID})

  const [renameGroup , isLoadingGroupName]  = useAsyncMutation(useRenameGroupMutation)
  const [removeMember, isLoadingRemoveMember]  = useAsyncMutation(useRemoveGroupMemberMutation)
  const [addMembers, isLoadingAddMembers]  = useAsyncMutation(useAddGroupMemberMutation)
  const [deleteGroup, isLoadingdeleteGroup]  = useAsyncMutation(useDeleteChatMutation)

  const errors = [
    { isError : myGroups.isError , errors : myGroups.error},
    { isError :groupDetails.isError , errors :groupDetails.error},
  ]

  useErrors(errors)

  useEffect(()=>{
     if(groupDetails.data){
      setGroupName(groupDetails.data.chat.name)
      setGroupNameUpdated(groupDetails.data.chat.name)
      setMembers(groupDetails.data.chat.members )
     }

     return ()=>{
      setGroupName("")
      setGroupNameUpdated("")
      setMembers([])
      setIsEditing(false)
     }
  },[groupDetails.data])

  const navigateBack = () => {
    navigate('/')
  }

  const handleMobile = () => {
    setIsMobileOpen((prev) => !prev)
  }

  const handleClose = () => {
    setIsMobileOpen(false)
  }

  const handleUpdateGrroupName = () => {
    setIsEditing(false)
    renameGroup("Updating group name ..." , {chatId : chatID , name : groupNameUpdated})
  }

  const handleOpenConfirmDeleteDialog = () => {
    setOpenConfirmDelete(true)

  }

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDelete(false)
  }

  const handleAddMembers = () => {
      dispatch(setIsAddMember(true))
  }

  const handleDeleteGroup = () => {
    console.log("in handle delete grp ",chatID)
    deleteGroup("Deleting group...",{chatId : chatID})
    handleCloseConfirmDeleteDialog()
    chatID=null
    navigate("/groups")
  }

  const handleRemoveMember = (userId) => {
    console.log(userId, 'in remove add member')
    removeMember("Removing grroup member...",{chatId:chatID , userId})
    
  }

  return myGroups.isLoading ? <LoaderLayout/> : (
    <Grid container height={"100vh"}>
      <Grid item
        sx={{
          display: {
            xs: 'none', sm: 'block'
          }
        }} sm={4} bgcolor={'bisque'}
      >
        <Typography variant='h5' style={{
          display:'flex' , alignItems:'center' , justifyContent:'center' , marginTop:'1rem' , paddingBottom:'1rem',borderBottom:'2px solid black'
        }}>My Groups</Typography>
        <GroupLists myGroups={myGroups?.data?.groups} chatID={chatID} />

      </Grid>

      <Grid item xs={12} sm={8}
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'
        }}
      >

        <Tooltip title='back'>
          <IconButton sx={{
            backgroundColor: `${metalBlack}`, color: 'white', position: 'absolute', top: '2rem', left: '2rem', ':hover': { bgcolor: 'rgba(0,0,0,0.5)' }
          }} onClick={navigateBack}>
            <KeyboardBackspaceRounded />
          </IconButton>
        </Tooltip>


        <IconButton sx={{
          position: 'fixed', top: '2rem', right: '2rem', display: { xs: 'block', sm: 'none' }, ':hover': { bgcolor: gray }
        }} onClick={handleMobile}>
          <Menu />
        </IconButton>

        <Stack direction={"row"}
          alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}
        >

          {
            isEditing ?
              <>
                <TextField value={groupNameUpdated} onChange={(e) => setGroupNameUpdated(e.target.value)} />
                <IconButton onClick={handleUpdateGrroupName} disabled={isLoadingGroupName}>
                  <Done />
                </IconButton>
              </>
              :
              <>
                {
                  groupName && (
                    <Container component={'div'} style={{
                      maxWidth: '100vw', width: '100%'
                    }} >

                      <Stack direction={'row'} spacing={"2rem"} >
                        <Typography variant='h4'>{groupName}</Typography>
                        <IconButton onClick={() => setIsEditing(true)} disabled={isLoadingGroupName}>
                          <Edit />
                        </IconButton>
                      </Stack >

                      <Typography alignSelf={'center'} variant='body1' padding={"2rem"}>
                        Members
                      </Typography>
                      <Stack maxWidth={"100vw"} width={"100%"} boxSizing={"border-box"} spacing={"2rem"} height={"50vh"} overflow={"auto"}
                        padding={{
                          sm: '1rem', xs: '0', md: '1rem 4rem'
                        }}
                      >
                        { isLoadingRemoveMember ? <CircularProgress/> :
                          members.map((user) => (
                            <UserItem user={user} key={user._id} styling={{
                              boxShadow: "0 0 0.5 rgba(0,0,0,0.2)",
                              padding: "1rem 2rem",
                              border: "1px solid black",
                              borderRadius: "1rem"
                            }} handler={handleRemoveMember} isAdded />
                          ))
                        }
                      </Stack>
                    </Container>
                  )
                }
              </>
          }
        </Stack>
        <Stack
          direction={{
            sm: 'row', xs: 'column-reverse'
          }} spacing={"1rem"}
          padding={{
            sm: '1rem', xs: '0'
          }}
        >
          {
            chatID ? (<>
            <Button size='large' variant='outlined' onClick={handleOpenConfirmDeleteDialog} startIcon={<Delete />} color='error'>Delete Group </Button>
            <Button size='large' variant='contained' onClick={handleAddMembers} startIcon={<Add />}> Add Members </Button>
            </>):(
              <Typography variant='h5'>Select a group to manage !</Typography>
            )
          }
        </Stack>
      </Grid>

      {
        openConfirmDelete &&
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog open={openConfirmDelete} handleClose={handleCloseConfirmDeleteDialog} deleteHandler={handleDeleteGroup} />

        </Suspense>
      }

      {
        isAddMember &&
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatID} />
        </Suspense>
      }
      <Drawer sx={{
        display: { xs: 'block', sm: 'none' }
      }} open={isMobileOpen} onClose={handleClose}>
        <GroupLists w={'50vw'} myGroups={myGroups?.data?.groups} chatID={chatID} />
      </Drawer>
    </Grid>
  )
}

const GroupLists = ({ chatID, w = "100%", myGroups = [] }) => {
  console.log('in grrp lists ', myGroups, chatID)
  return (
    <Stack width={w}>
      {
        myGroups.length > 0 ?
          myGroups.map((group) => {
            return <GroupListItem group={group} key={group._id} chatID={chatID} />
          })
          :
          <Typography variant='h4' textAlign={'center'} marginTop={"2rem"} >No groups to display</Typography>
      }
    </Stack>
  )
}

const GroupListItem = ({ group, chatID }) => {
  const { name, avatar, _id } = group

  console.log('in grp list item ', group)
  return (
    // <Link to={`?group=${_id}`} onClick={(e )=> {if (_id === chatID) e.preventDefault();}} style={{
    //   paddingTop:'2rem' , textDecoration:'none'
    // }}>
    //   <Stack direction={'row'}  style={{
    //       display:'flex' , alignItems:'center' ,
    //       padding:'1rem' , position:'relative' , gap:'1rem',}}>
    //     <AvatarCard avatar={avatar} />
    //     <Typography color='black' >{name}</Typography>
    //   </Stack>
    // </Link>
    <Link to={`?group=${_id}`} onClick={(e) => { if (_id === chatID) e.preventDefault(); }}
      style={{
        textDecoration: 'none', color: 'inherit', paddingLeft: '2rem', borderBottom: "1px solid black"
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '1rem', position: 'relative', gap: '1rem',

      }}>
        <AvatarCard avatar={avatar} />
        <Stack>
          <Typography variant='h6'
          // sx={{color:sameSender?'black':'inherit'}}
          >{name}</Typography>

        </Stack>

      </div>
    </Link>

  )
}

export default Group