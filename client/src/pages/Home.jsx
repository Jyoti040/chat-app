import React from 'react'
import AppLayout from '../components/Layout/AppLayout'
import { Typography , Box} from '@mui/material';

const Home = () => {
  return (
    <Box bgcolor={"rgba(0,0,0,0.1)"} height={"100%"}>
      <Typography variant='h5' textAlign={"center"} padding={"2rem"}>Select a friend to chat</Typography>
    </Box>
  )
}

export default AppLayout()(Home);