import React , {lazy, Suspense, useEffect} from 'react'
import {BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import {LoaderLayout }from './components/Layout/Loaders'
import axios from 'axios'
import { server } from './constants/config'
import { useDispatch, useSelector } from 'react-redux'
import { userExists, userNotExists } from './redux/reducers/auth'
import { Toaster } from "react-hot-toast"
import { SocketProvider } from './socket'

const Home = lazy(()=>import('./pages/Home'))  
const Login = lazy(()=>import('./pages/Login'))  
const Chat = lazy(()=>import('./pages/Chat'))  
const Group = lazy(()=>import('./pages/Group'))  
const Register = lazy(()=>import('./pages/Register'))  
const PageNotFound = lazy(()=>import('./pages/PageNotFound'))  
const Profile = lazy(()=>import('./pages/Profile'))  

const App = () => {
  const dispatch=useDispatch()
  const {user , loader } = useSelector(state =>state.auth)

  useEffect(()=>{
    axios.get(`${server}/api/v1/user/my-profile`,{withCredentials:true})
    .then((data)=>{
      console.log('in app.js ' , data?.data?.user)
      dispatch(userExists(data?.data?.user))
    })
    .catch((err)=>{
      dispatch(userNotExists())
    })
  },[dispatch])

  return loader ?
   <LoaderLayout/> :  (
    <Router>
      <Suspense fallback={<LoaderLayout/>}>
      <Routes>
        {/* <Route path='/' element={<ProtectedRoute user={user}>
          <Home />
        </ProtectedRoute>}/> */}
        <Route element={
          <SocketProvider>  
             <ProtectedRoute user={user}/>
          </SocketProvider>
        }>
        
           <Route path='/' element={<Home/>}/>
           <Route path='/chat/:chatID' element={<Chat/>}/>
           <Route path='/groups' element={<Group/>}/>
           <Route path='/profile/:userID' element={<Profile/>}/>
        </Route>
        <Route path='/login' element={<ProtectedRoute user={!user} redirect='/'>
             <Login/>
        </ProtectedRoute>}/>
        <Route path='/register' element={<ProtectedRoute user={!user} redirect='/'>
             <Register/>
        </ProtectedRoute>}/>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
      </Suspense>
      
      <Toaster position='bottom-center'/>
    </Router>
  )
}

export default App