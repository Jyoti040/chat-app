import { Add, Remove } from '@mui/icons-material'
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { transformImage } from '../../lib/features'
import { useSelector } from 'react-redux'

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling = {} }) => {

    const { name, _id, avatar } = user
    // const isFriendAdded = useSelector((state)=>state.misc)

    return (
        <ListItem>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} {...styling} >
                <Avatar src={transformImage(avatar)} />
                <Typography
                    variant='body1'
                    sx={{
                        flexGrow: '1',
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%"
                    }}
                >{name}
                </Typography>
                <IconButton onClick={() => handler(_id)} disabled={handlerIsLoading}
                    size='small' sx={{ bgcolor: isAdded ? 'error.main' : 'primary.main', color: 'white', "&:hover": { bgcolor: isAdded ? 'error.dark' : "primary.dark" } }}
                >
                    {isAdded ? <Remove /> : <Add />}
                </IconButton>
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem)