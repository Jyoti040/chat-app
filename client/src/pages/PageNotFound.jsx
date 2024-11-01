import { Container, Typography } from '@mui/material'
import React from 'react'

const PageNotFound = () => {
  return (
    <div >
        <Container component={"main"} maxWidth='sm' sx={{display:'flex', flexDirection:"row", alignItems:"center" , justifyContent:"center" , height:"100vh"}}>
           <Container component={"div"} sx={{display:'flex', flexDirection:"column", alignItems:"center" , justifyContent:"center"}}>
             <Typography variant='h5' color='error'>Error 404 ,  Page not found !!</Typography>
              <Typography variant='h6' sx={{marginTop:"1rem"}}>Please enter a valid url</Typography>
           </Container>
        </Container>
    </div>
  )
}

export default PageNotFound