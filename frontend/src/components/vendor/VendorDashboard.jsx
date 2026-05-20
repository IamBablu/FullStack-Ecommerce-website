import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Orders from './Orders'
import Products from './Products'


  

const VendorDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = ()=> {
    switch (activePage) {
      case 'orders': return <Orders />
      case 'products': return <Products />
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
    Vendor Dashboard
  </div>
}

export default VendorDashboard
