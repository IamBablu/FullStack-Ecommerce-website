import React, { useState } from 'react'
import Sidebar from './Sidebar'
import UserOrders from './UserOrders'
import VendorApproval from './VendorApproval'
import VendorDetails from './VendorDetails'
import ProductRequest from './ProductRequest'
import { div } from 'motion/react-client'


  

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard')

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
      <Sidebar activePage={activePage} setActivePage={setActivePage}/>
      <div className='bg-red-500 w-[80%]'>
      {renderPage()}
      </div>
    </div>
  )
}

const Dashboard = () =>{
  return <div>
    Admin Dashboard
  </div>
}

export default AdminDashboard
