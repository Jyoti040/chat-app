import React , {lazy, Suspense} from 'react'
import {BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'

const Home = lazy(()=>import('./pages/Home'))  
const Login = lazy(()=>import('./pages/Login'))  
const Chat = lazy(()=>import('./pages/Chat'))  
const Group = lazy(()=>import('./pages/Group'))  
const Register = lazy(()=>import('./pages/Register'))  
const PageNotFound = lazy(()=>import('./pages/PageNotFound'))  

const App = () => {
  let user = true;

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* <Route path='/' element={<ProtectedRoute user={user}>
          <Home />
        </ProtectedRoute>}/> */}
        <Route element={<ProtectedRoute user={user}/>}>
        
           <Route path='/' element={<Home/>}/>
           <Route path='/chat/:chatID' element={<Chat/>}/>
           <Route path='/groups' element={<Group/>}/>
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
      
    </Router>
  )
}

export default App