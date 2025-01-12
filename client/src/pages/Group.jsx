import { Add, Delete, Done, Edit, KeyboardBackspace, KeyboardBackspaceRounded, Menu } from '@mui/icons-material'
import { Grid2, Grid, Tooltip, IconButton, Drawer, Stack, Typography, TextField, Container, Button, Backdrop } from '@mui/material'
import React, { lazy, memo, Suspense, useState } from 'react'
import { gray, metalBlack } from '../constants/colors'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AvatarCard from '../components/Shared/AvatarCard'
import { sampleChats, sampleUsers } from '../constants/sampleData'
import UserItem from '../components/Shared/UserItem'
import { useMyGroupsQuery } from '../redux/api/api'
import { useErrors } from '../hooks/hooks'
import { LoaderLayout } from '../components/Layout/Loaders'
//import { StyledLink } from '../styles/StyledComponents'

// const chatID='abcd' //sample
const ConfirmDeleteDialog = lazy(() => import('../components/dialog/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialog/AddMemberDialog'))

const isAddMember = false; // temp var to show add members option 

const Group = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [groupName, setGroupName] = useState("Test Name")
  const [groupNameUpdated, setGroupNameUpdated] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  const navigate = useNavigate()

  const chatID = useSearchParams()[0].get('group')

  const myGroups = useMyGroupsQuery("")

  const errors = [
    { isError : myGroups.isError , errors : myGroups.error}
  ]

  useErrors(errors)

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
  }

  const handleOpenConfirmDeleteDialog = () => {
    setOpenConfirmDelete(true)
  }

  const handleCloseConfirmDeleteDialog = () => {
    setOpenConfirmDelete(false)
  }

  const handleAddMembers = () => {

  }
  const handleDeleteGroup = () => {
    setOpenConfirmDelete(false)
  }

  const handleRemoveMember = (id) => {
    console.log(id, 'in remove add member')
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
        <GroupLists myGroups={sampleChats} chatID={chatID} />

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
                <IconButton onClick={handleUpdateGrroupName}>
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
                        <Typography variant='h4'>{groupName} {chatID}</Typography>
                        <IconButton onClick={() => setIsEditing(true)}>
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
                        {
                          sampleUsers.map((user) => (
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
          <Button size='large' variant='outlined' onClick={handleOpenConfirmDeleteDialog} startIcon={<Delete />} color='error'>Delete Group </Button>
          <Button size='large' variant='contained' onClick={handleAddMembers} startIcon={<Add />}> Add Members </Button>

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
          <AddMemberDialog />
        </Suspense>
      }
      <Drawer sx={{
        display: { xs: 'block', sm: 'none' }
      }} open={isMobileOpen} onClose={handleClose}>
        <GroupLists w={'50vw'} myGroups={sampleChats} chatID={chatID} />
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