import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { CameraAlt } from '@mui/icons-material'
import { VisuallyHiddenInput } from '../components/styles/StyledComponents'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { server } from '../constants/config'
import { useDispatch } from 'react-redux'
import { userExists } from '../redux/reducers/auth'
import toast from 'react-hot-toast'

const Register = () => {

    const [showPassword, setShowPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [passwordValidateMessage, setPasswordValidateMessage] = useState('')
    const [bio, setBio] = useState("")
    const [image, setImage] = useState(null)
    const [imageToSend, setImageToSend] = useState(null)
    const [loading, setIsLoading] = useState(false)

    const dispatch = useDispatch()

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImageToSend(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result)
                console.log("in handle image ", reader)
            }
            reader.readAsDataURL(file) // set url of file
            console.log("in handle image 1", reader)
            console.log("in handle image 2 ", file)
        }
        // setImage(file)
    }

    const handlePassword = (e) => {
        let tempPassword = e.target.value;
        setPassword(tempPassword)

        var lowerCase = /[a-z]/g;
        var upperCase = /[A-Z]/g;
        var digit = /\d/;
        var minLength = /.{8,}/;

        if (!minLength.test(password)) {
            setPasswordValidateMessage("Password must have atleast 8 characters");
            return;
        } else if (!digit.test(password)) {
            setPasswordValidateMessage("Password must have atleast 1 digit");
            return;
        } else if (!upperCase.test(password)) {
            setPasswordValidateMessage("Password must have atleast 1 uppercase letter");
            return;
        } else if (!lowerCase.test(password)) {
            setPasswordValidateMessage("Password must have atleast 1 lowercase letter ");
            return;
        } else {
            setPasswordValidateMessage("")
            return;
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()

        if (!imageToSend) {
            toast.error("Please upload an avatar to register ")
            return
        }
        setIsLoading(true)
        const toastId = toast.loading("Creating a new account")
        const config = {
            withCredentials: true,
        }

        const formData = new FormData()
        formData.append("name", name)
        formData.append("userName", userName)
        formData.append("userEmail", email)
        formData.append("password", password)
        formData.append("bio", bio)
        formData.append("avatar", imageToSend)

        try {
            const { data } = await axios.post(`${server}/api/v1/user/register`, formData, config)
            dispatch(userExists(data.user))
            toast.success(data.message, {
                id: toastId
            })
        } catch (error) {
            console.log("in register user ", error)
            toast.error(error?.response?.data?.message || "Something went wrong", {
                id: toastId
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container component={"main"} maxWidth='sm' sx={{
            height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2rem", marginBottom: "2rem"
        }}>
            <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <>
                    <Typography variant='h4'>Register</Typography>
                    <form style={{
                        width: "100%", marginTop: "1rem"
                    }}
                        onSubmit={handleRegister}
                    >
                        <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                            <Avatar sx={{
                                width: "10rem",
                                height: "10rem",
                                objectFit: "contain",

                            }}
                                src={image}
                            />
                            <IconButton sx={{
                                position: "absolute",
                                bottom: "0", right: "0",
                                color: "white",
                                bgcolor: "rgba(0,0,0,0.5)",
                                ":hover": {
                                    bgcolor: "rgba(0,0,0,0.7)",
                                },

                            }}
                                component="label"
                            >
                                <>
                                    <CameraAlt />
                                    <VisuallyHiddenInput type="file" accept='image/*' onChange={handleImage} />
                                </>
                            </IconButton>
                        </Stack>
                        <TextField required fullWidth label='Name' margin='normal' variant='outlined' value={name} onChange={(e) => setName(e.target.value)} />
                        <TextField required fullWidth label='UserName' margin='normal' variant='outlined' value={userName} onChange={(e) => setUserName(e.target.value)} />
                        <TextField required fullWidth label='Email' margin='normal' variant='outlined' value={email} onChange={(e) => setEmail(e.target.value)} />

                        <TextField required fullWidth label='Bio' margin='normal' variant='outlined' multiline rows={5} value={bio} onChange={(e) => setBio(e.target.value)} />
                        <TextField required fullWidth label='Password' type={showPassword ? 'text' : 'password'} margin='normal' variant='outlined' value={password} onChange={handlePassword}
                        />

                        {
                            passwordValidateMessage.length > 0 && <Typography variant='p' color='error'>
                                {passwordValidateMessage}
                            </Typography>
                        }

                        <Button color='primary' variant='contained' fullWidth type='submit' disabled={loading} >Register </Button>

                        <Typography
                            textAlign="center"
                            variant="body1"
                            sx={{ mt: "1rem", display: "block" }}
                        >
                            Already have an account ?
                            <Link to='/login'> LOGIN</Link>
                        </Typography>
                    </form>
                </>
            </Paper>
        </Container>
    )
}

export default Register