import React from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import {userDataContext} from './context/UserContext'
import UpdateVendorDetails from './components/vendor/UpdateVendorDetails'
import AddProduct from './components/vendor/AddProduct'
const App = () => {
  const {userdata, setUserData} = React.useContext(userDataContext)
  return (
    <Routes>
      <Route path = '/signup' element = {userdata? <Navigate to="/" /> : <Signup />} />
      <Route path = '/login' element = {userdata? <Navigate to="/" /> :<Login />} />
      <Route path = '/' element = {<Home />} />
      <Route path = '/update-vendor-details' element = {<UpdateVendorDetails />} />
      <Route path = '/add-product' element = {<AddProduct />} />
        
    </Routes>
  )
}

export default App
