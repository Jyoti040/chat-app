import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React , {useState} from 'react'
import {Search as SearchIcon} from '@mui/icons-material'
import UserItem from '../Shared/UserItem'
import { sampleUsers } from '../../constants/sampleData'

const Search = () => {

  const [searchValue , setSearchValue] = useState("")
  const [users,setUsers] = useState(sampleUsers)

  const isLoadingFriendRequest=false;

  const addFriendHandler=(id)=>{
    console.log('in add friend handler')
  }
  return (
    <Dialog open >
        <Stack width={"25rem"} direction={"column"} p={"2rem"} >
          <DialogTitle textAlign={"center"}>
            Find People
          </DialogTitle>

          <TextField 
           label="" variant='outlined' size='small'
           value={searchValue} onChange={(e)=>e.target.value}
           InputProps={{
            startAdornment:(
              <InputAdornment position='start'>
                <SearchIcon/>
              </InputAdornment>
            )
           }}
          />
        </Stack>

        <List>
          {
            users.map((user)=>(
             <UserItem
              user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingFriendRequest}
             />
            ))
          }
        </List>
    </Dialog>
  )
}

export default Search