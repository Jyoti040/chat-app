import { Button, Container, Paper,  TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../constants/config'
import { useDispatch } from 'react-redux'
import { userExists } from '../redux/reducers/auth'
import toast from 'react-hot-toast'

const Login = () => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        setIsLoading(true)
        const toastId = toast.loading("Signing in")

        const config = {
            withCredentials: true,
        }

        try {
            const { data } = await axios.post(`${server}/api/v1/user/login`, {
                userEmail: email,
                password
            }, config)
            console.log("in login success", data)
            dispatch(userExists(data.user))
            toast.success(data.message, {
                id: toastId
            })
            navigate("/")
        } catch (error) {
            console.log("in login error", error)
            toast.error(error?.response?.data?.message || "Something went wrong", {
                id: toastId
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            backgroundImage: "linear-gradient(rgba(200,200,200,0.5),rgba(120,110,220,0.5))"
        }}>
            <Container component={"main"} maxWidth='sm' sx={{
                height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <>
                        <Typography variant='h4'>Login</Typography>
                        <form style={{
                            width: "100%", marginTop: "1rem"
                        }}
                            onSubmit={handleLogin}
                        >
                            <TextField required fullWidth label='Email' margin='normal' variant='outlined' value={email} onChange={(e) => setEmail(e.target.value)} />
                            <TextField required fullWidth label='Password' type='password' margin='normal' variant='outlined' value={password} onChange={(e) => setPassword(e.target.value)} />
                             <Button color='primary' variant='contained' fullWidth type='submit' disabled={loading}>Login</Button>
                            <Typography
                                textAlign="center"
                                variant="body1"
                                sx={{ mt: "1rem", display: "block" }}
                            >
                                No account ? Create one
                                <Link to='/register'> REGISTER</Link>
                            </Typography>

                        </form>
                    </>
                </Paper>
            </Container>
        </div>
    )
}

export default Login