import React from 'react'
import { Avatar, Container, IconButton, Stack, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { setShowProfile } from '../../redux/reducers/misc'

const Profile = ({ user }) => {
  const dispatch = useDispatch()

  const handleCloseProfile = () => {
    dispatch(setShowProfile(false))
  }

  return (
    <Container component={"div"} maxWidth={"md"} sx={{ height: '100%', bgcolor: "black", position: 'relative' }}>
      <IconButton 
        sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }} 
        onClick={handleCloseProfile}
      >
        <Close />
      </IconButton>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '3px solid black' }}>
        <Avatar src={user.avatar?.url} sx={{
          height: 200, width: 200, paddingTop: '0rem', marginTop: '1rem',
          border: "2px solid black"
        }} />
        <ProfileCard heading={"Name"} value={user.name} />
        <ProfileCard heading={"UserName"} value={user.userName} />
        <ProfileCard heading={"Email"} value={user.userEmail} />
        <ProfileCard heading={"Bio"} value={user.bio} />
        <ProfileCard heading={"Joined"} value={moment(user.createdAt).fromNow()} />
      </div>
    </Container>
  )
}

export default Profile

const ProfileCard = ({ heading, value }) => {
  return (
    <Stack alignItems={"center"} spacing={"0.3rem"} marginTop={"2rem"}>
      <Typography variant='body1' color='white'>{value}</Typography>
      <Typography color='grey' variant='caption'>{heading}</Typography>
    </Stack>
  )
}
