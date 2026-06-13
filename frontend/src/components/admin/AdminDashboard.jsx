import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import UserOrders from './UserOrders'
import VendorApproval from './VendorApproval'
import VendorDetails from './VendorDetails'
import ProductRequest from './ProductRequest'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'



  

const AdminDashboard = () => {
  const {serverUrl, vendors, setVendors, products, setProducts, activePage, setActivePage} = React.useContext(userDataContext) 


 const getVendors = async()=> {
     try {
       const result = await axios.get(`${serverUrl}/admin/get-vendors`, {withCredentials: true})
      
       setVendors(result.data.data)
     } catch (error) {
       setVendors(null)
       console.error(error)
     }
   }

 const getProducts = async()=> {
     try {
       const result = await axios.get(`${serverUrl}/admin/get-products`, {withCredentials: true})
       setProducts(result.data.data)
     } catch (error) {
       setProducts(null)
       console.error(error)
     }
   }
   

  useEffect(()=>{
    getVendors();
    getProducts();
  },[])



  const renderPage = ()=> {
    switch (activePage) {
      case 'vendors': return <VendorDetails />
      case 'orders': return <UserOrders />
      case 'vendor-approval': return <VendorApproval />
      case 'product-approval': return <ProductRequest />
      default : return <Dashboard /> 
    }
  }


  return (
    <div className='flex justify-end h-screen w-screen pt-20'>
        <Sidebar activePage={activePage} setActivePage={setActivePage} css='hidden md:block'/>
      <div className='w-full md:w-4/5'>
      {renderPage()}
      </div>
    </div>
  )
}

export const Dashboard = () =>{
  return <div>
    Admin Dashboard
  </div>
}

export default AdminDashboard
