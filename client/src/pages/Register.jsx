import { Avatar, Button, Container, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material'
import React ,{ useState} from 'react'
import { CameraAlt , VisibilityOff , Visibility  } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents'
import { Link } from 'react-router-dom'
// import { useInputValidation } from '6pp'
// import { usernameValidator } from '../utils/validators'

const Register = () => {
 const [isRegister , setIsRegister] = useState(true)
 const [error , setError]= useState(false)
 const [showPassword , setShowPassword] = useState("")

//  const name=useInputValidation("");
//  const username=useInputValidation("",usernameValidator);
//  const bio=useInputValidation("");
//  const password=useInputValidation("");

//  console.log('username' , username)
const [userName , setUserName] = useState("")
const [email , setEmail] = useState("")
const [name , setName] = useState("")
const [password , setPassword] = useState("")
const [passwordValidateMessage,setPasswordValidateMessage] = useState('')
const [bio , setBio] = useState("")
const [image , setImage] = useState(null)

const handlePassword = (e)=>{
    let tempPassword=e.target.value;
    setPassword(tempPassword)

    var lowerCase=/[a-z]/g;
    var upperCase=/[A-Z]/g;
    var digit=/\d/;
    var minLength=/.{8,}/;

    if(!minLength.test(password)) {
        setPasswordValidateMessage("Password must have atleast 8 characters");
        return;
    }else if(!digit.test(password)){
        setPasswordValidateMessage("Password must have atleast 1 digit");
        return;
    }else if(!upperCase.test(password)){
        setPasswordValidateMessage("Password must have atleast 1 uppercase letter");
        return;
    }else if(!lowerCase.test(password)){
        setPasswordValidateMessage("Password must have atleast 1 lowercase letter ");
        return;
    }else{
        setPasswordValidateMessage("")
        return;
    }
}

const togglePasswordVisibility=()=>{
    setShowPassword(!showPassword)
}

const handleImage=(e)=>{
   const file=e.target.files[0];
   if(file){
    const reader = new FileReader();
    reader.onload=()=>{
        setImage(reader.result)
    }
    reader.readAsDataURL(file) // set url of file
   }
}

const handleRegister = (e)=>{
    e.preventDefault()
}
  return (
    <Container component={"main"} maxWidth='sm' sx={{
        height:"100vh" , display:"flex" , alignItems:"center" , justifyContent:"center" , marginTop:"2rem" ,  marginBottom:"2rem"
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
            }
              */}
                 <>
                <Typography variant='h5'>Register</Typography>
                <form style={{
                    width:"100%" , marginTop:"1rem"
                }}
                onSubmit={handleRegister}
                >
                    <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                        <Avatar sx={{
                            width:"10rem",
                            height:"10rem",
                            objectFit:"contain",
                            
                        }}
                        src={image}
                        />
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
                               <VisuallyHiddenInput type="file"  accept='image/*' onChange={handleImage}/> 
                            </>
                        </IconButton>
                    </Stack>
                    <TextField  required fullWidth label='Name' margin='normal' variant='outlined' value={name} onChange={(e)=>setName(e.target.value)}/>
                    <TextField  required fullWidth label='UserName' margin='normal' variant='outlined' value={userName} onChange={(e)=>setUserName(e.target.value)}/>
                    <TextField  required fullWidth label='Email' margin='normal' variant='outlined' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                
                    <TextField  required fullWidth label='Bio' margin='normal' variant='outlined' multiline rows={5} value={bio} onChange={(e)=>setBio(e.target.value)}/>
                    <TextField  required fullWidth label='Password' type={showPassword?'text':'password'} margin='normal' variant='outlined' value={password} onChange={handlePassword}
                    //  InputProps={{
                    //     endAdornment:(
                    //         <InputAdornment position='end'>
                    //              <IconButton onClick={togglePasswordVisibility}>
                    //                   {showPassword?<VisibilityOff/>:<Visibility/>}
                    //              </IconButton>
                    //         </InputAdornment>
                    //     )
                    //  }}
                    />

                    {
                        passwordValidateMessage.length>0 && <Typography variant='p' color='error'>
                            {passwordValidateMessage}
                        </Typography>
                    }    

                    <Button color='primary' variant='contained' fullWidth type='submit' >Sign Up/Register </Button>

                    <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                 <Link to='/login'>
                   {/* <Button variant='text' fullWidth color='secondary' onClick={()=>setIsRegister(false)} >Login</Button> */}
                   Login
                 </Link>
                </form>
                </>
         </Paper>


    </Container>
  )
}

export default Register