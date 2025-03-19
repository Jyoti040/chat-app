import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({children,user,redirect='/login'}) => {
  if(user) 
    return children?children:<Outlet/>

  return <Navigate to={redirect}/>
}

export default ProtectedRoute