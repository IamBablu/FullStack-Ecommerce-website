import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
const App = () => {
  return (
    <Routes>
      <Route path = '/signup' element = {<Signup />} />
      <Route path = '/login' element = {<Login />} />
        
    </Routes>
  )
}

export default App
