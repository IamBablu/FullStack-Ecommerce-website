import React from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import {userDataContext} from './context/UserContext'
import UpdateVendorDetails from './components/vendor/UpdateVendorDetails'
import AddProduct from './components/vendor/AddProduct'
import EditProduct from './components/vendor/EditProduct'
import UserProduct from './components/user/UserProduct'
import CartPage from './components/user/CartPage'
const App = () => {
  const {userdata, setUserData} = React.useContext(userDataContext)
  return (
    <Routes>
      <Route path = '/signup' element = {userdata? <Navigate to="/" /> : <Signup />} />
      <Route path = '/login' element = {userdata? <Navigate to="/" /> :<Login />} />
      <Route path = '/' element = {<Home />} />
      <Route path = '/update-vendor-details' element = {<UpdateVendorDetails />} />
      <Route path = '/add-product' element = {<AddProduct />} />
      <Route path = '/edit-product' element = {<EditProduct />} />
      <Route path = '/user-product' element = {<UserProduct />} />
      <Route path = '/cart-page' element = {<CartPage />} />
        
    </Routes>
  )
}

export default App
