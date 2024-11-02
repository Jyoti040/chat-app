import React from 'react'
import { Grid, Skeleton, Stack } from '@mui/material'

const LoaderLayout = () => {
  return (
    <Grid container sx={{ height: 'calc(100vh - 4rem)' }} spacing={"1rem"}>
    <Grid item sm={4} height={"100%"} sx={{display:{xs:'none' , sm:'block'}}}>
      <Skeleton variant='rectangular' height={"100vh"} width={"100%"}/>
    </Grid>
    <Grid item xs={12} sm={8} height={"100%"} >
        <Stack spacing={"1rem"}>
        {
          Array.from({length:10}).map((_,index)=>(
              <Skeleton key={index} variant='rectangular' height={"100"} width={"100%"}/>  // 10rem-160px
          ))
        }
        </Stack>
    </Grid>
</Grid>
  )
}

export default LoaderLayout