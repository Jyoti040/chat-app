import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import React ,{ useState} from 'react'
import {Link} from 'react-router-dom'
import { CameraAlt  } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents'
// import { useInputValidation } from '6pp'
// import { usernameValidator } from '../utils/validators'

const Login = () => {
 const [isLogin , setIsLogin] = useState(true)
 const [error , setError]= useState(false)
//  const name=useInputValidation("");
//  const username=useInputValidation("",usernameValidator);
//  const bio=useInputValidation("");
//  const password=useInputValidation("");

//  console.log('username' , username)
const [email , setEmail] = useState("")
const [password , setPassword] = useState("")

const handleLogin = (e)=>{
    e.preventDefault()
}
  return (
 <div style={{
    backgroundImage:"linear-gradient(rgba(200,200,200,0.5),rgba(120,110,220,0.5))"
 }}>
       <Container component={"main"} maxWidth='sm' sx={{
        height:"100vh" , display:"flex" , alignItems:"center" , justifyContent:"center"
    }}>
         <Paper elevation={3} sx={{padding:4 , display:'flex' , flexDirection:'column' , alignItems:'center'}}>
            {/* {
                isLogin ? <>
                <Typography variant='h5'>Login</Typography>
                <form style={{
                    width:"100%" , marginTop:"1rem"
                }}>
                    <TextField  required fullWidth label='Username' margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler}/>
                
                    <TextField  required fullWidth label='Password' type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler}/>

                    <Button color='primary' variant='contained' fullWidth type='submit'>Login</Button>

                    <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                    <Button variant='text' fullWidth color='secondary' onClick={()=>setIsLogin(false)}>Register</Button>
                </form>
                </>
                 : 
                 <>
                <Typography variant='h5'>Login</Typography>
                <form style={{
                    width:"100%" , marginTop:"1rem"
                }}>
                    <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                        <Avatar sx={{
                            width:"10rem",
                            height:"10rem",
                            objectFit:"contain"
                        }}/>
                        <IconButton sx={{
                            position:"absolute" , 
                            bottom:"0" , right:"0",
                            color:"white",
                            bgcolor:"rgba(0,0,0,0.5)",
                            ":hover":{
                                bgcolor:"rgba(0,0,0,0.7)",
                            },
                           
                        }}
                         component="label"
                        >
                            <>
                              <CameraAlt />
                               <VisuallyHiddenInput type="file"/> 
                            </>
                        </IconButton>
                    </Stack>
                    <TextField  required fullWidth label='Name' margin='normal' variant='outlined' value={name.value} onChange={name.changeHandler}/>
                    <TextField  required fullWidth label='UserName' margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler}/>
                    
                    <TextField  required fullWidth label='Bio' margin='normal' variant='outlined' value={bio.value} onChange={bio.changeHandler}/>
                    <TextField  required fullWidth label='Password' type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler} />

                    <Button color='primary' variant='contained' fullWidth type='submit'>Sign Up/Register </Button>

                    <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                    <Button variant='text' fullWidth color='secondary' onClick={()=>setIsLogin(true)} >Login</Button>
                </form>
                </>
            } */}
            <>
                <Typography variant='h5'>Login</Typography>
                <form style={{
                    width:"100%" , marginTop:"1rem"
                }}
                onSubmit={handleLogin}
                >
                    <TextField  required fullWidth label='Email' margin='normal' variant='outlined' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                
                    <TextField  required fullWidth label='Password' type='password' margin='normal' variant='outlined' value={password} onChange={(e)=>setPassword(e.target.value)}/>

                    <Button color='primary' variant='contained' fullWidth type='submit'>Login</Button>

                    <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                    <Link to='/register'>
                       {/* <Button variant='text' fullWidth color='secondary' onClick={()=>setIsLogin(false)}>Register</Button> */}
                       Register
                    </Link>
                </form>
                </>
         </Paper>


    </Container>
 </div>
  )
}

export default Login