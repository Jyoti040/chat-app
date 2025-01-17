import { Error } from '@mui/icons-material'
import { Container, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div >
        <Container component={"main"} maxWidth='lg' sx={{display:'flex', flexDirection:"row", alignItems:"center" , justifyContent:"center" , height:"100vh"}}>
           <Container component={"div"} sx={{display:'flex', flexDirection:"column", alignItems:"center" , justifyContent:"center"}}>
             <Error sx={{fontSize:"8rem"}}/>
             <Typography variant='h2' color='error'>Error 404 ,  Page not found !!</Typography>
              <Typography variant='h4' sx={{marginTop:"1rem"}}>Please enter a valid url</Typography>
              <Link to="/">Go back to home</Link>
           </Container>
        </Container>
    </div>
  )
}

export default PageNotFound