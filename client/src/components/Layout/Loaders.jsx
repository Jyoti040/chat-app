import React from 'react'
import { Grid, Skeleton, Stack } from '@mui/material'
import { BouncingSkeleton } from '../styles/StyledComponents'

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

const TypingLoader = () => {
    return (
      <Stack spacing={"0.5rem"} direction={"row"} padding={"0.5rem"} justifyContent={"center"}>
         <BouncingSkeleton variant='circular' width={15} height={15} style={{animationDelay:"0.1s"}}/>
         <BouncingSkeleton variant='circular' width={15} height={15} style={{animationDelay:"0.2s"}}/>
         <BouncingSkeleton variant='circular' width={15} height={15} style={{animationDelay:"0.4s"}}/>
         <BouncingSkeleton variant='circular' width={15} height={15} style={{animationDelay:"0.6s"}}/>
      </Stack>
    )
}

export {LoaderLayout , TypingLoader}