import { AvatarGroup, Stack ,Box, Avatar} from '@mui/material'
import React from 'react'
import { transformImage } from '../../lib/features'

const AvatarCard = ({avatar=[] , max=4}) => {
  return (
    <Stack direction={"row"} spacing={0.5} sx={{paddingLeft:"1rem"}}>
     <AvatarGroup max={max}>
        <Box height={"3rem"} width={"4rem"}>
           {
            avatar?.map((a,index)=>(
               <Avatar
                key={index} src={transformImage(a)}
                alt='Avatar'
                sx={{
                    width:"2rem" ,
                    height:"2rem",
                    position:'absolute',
                    left:{
                        xs:`${0.5+index}rem`,
                        sm:`${index}rem`
                    }
                }}
               />
            ))
           }
        </Box>
     </AvatarGroup>
    </Stack>
  )
}

export default AvatarCard