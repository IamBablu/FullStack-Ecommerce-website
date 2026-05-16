import React from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import {userDataContext} from './context/UserContext'
const App = () => {
  const {userdata, setUserData} = React.useContext(userDataContext)
  return (
    <Routes>
      <Route path = '/signup' element = {userdata? <Navigate to="/" /> : <Signup />} />
      <Route path = '/login' element = {userdata? <Navigate to="/" /> :<Login />} />
      <Route path = '/' element = {<Home />} />
        
    </Routes>
  )
}

export default App
