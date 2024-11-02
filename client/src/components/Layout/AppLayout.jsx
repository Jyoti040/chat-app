import React from 'react'
import Header from './Header'
import Title from '../Shared/Title'
import { Grid } from '@mui/material'
import ChatLists from '../Shared/ChatLists'

const AppLayout = () => (WrappedComponent)=> {  //HOC - Higher order component
  return (props)=>{
    return (
        <>
            <Title/>
            <Header/>

            <Grid container sx={{ height: 'calc(100vh - 4rem)' }}>
                 <Grid item sm={4} height={"100%"} sx={{display:{xs:'none' , sm:'block'}}}>
                    <ChatLists/>
                 </Grid>
                 <Grid item xs={12} sm={8} height={"100%"} >
                     <WrappedComponent {...props}/>
                 </Grid>
            </Grid>
        </>
    )
  }
}

export default AppLayout