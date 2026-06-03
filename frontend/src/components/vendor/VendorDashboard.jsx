import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Orders from './Orders'
import Products from './Products'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'


  

const VendorDashboard = () => {
  const {serverUrl, userdata, setUserData, products, setProducts, activePage, setActivePage} = useContext(userDataContext)

  const renderPage = ()=> {
    switch (activePage) {
      case 'orders': return <Orders />
      case 'products': return <Products />
      default : return <Dashboard /> 
    }
  }

  const getProducts = async() =>{
    try {
      const result = await axios.get(`${serverUrl}/product/get-my-product`,{withCredentials: true})
      setProducts(result.data.data)
    } catch (error) {
      console.error(error)
      setProducts(null)
    }
  }

  useEffect(()=>{
    setActivePage("dashboard")
    getProducts();
  },[]);


  return (
    <div className='flex justify-end h-screen w-screen pt-20'>
      <Sidebar activePage={activePage} setActivePage={setActivePage}/>
      <div className='w-[80%]'>
      {renderPage()}
      </div>
    </div>
  )
}

const Dashboard = () =>{
  return <div>
    Vendor Dashboard
  </div>
}

export default VendorDashboard
