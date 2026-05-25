import { label } from 'motion/react-client'
import React from 'react'
import { MdDashboard } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaBox } from "react-icons/fa";

const Sidebar = ({ activePageAdmin, setActivePageAdmin, css='', setOpenMenu }) => {

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22}/> },
    { id: "vendors", label: "Vendor Details", icon: <FaStore size={22}/> },
    { id: "orders", label: "User Orders", icon: <FaShoppingBag size={22}/> },
    { id: "vendor-approval", label: "Vendor Approval", icon: <FaCheckCircle size={22}/> },
    { id: "product-approval", label: "product Requests", icon: <FaBox size={22}/> }
  ]


  return (
    <div className={`bg-gray-900 w-[20%] pl-5 pt-3 ${css}`}>
      <h1 className='text-2xl'>Admin Panel</h1>
      {
        menu.map((item, index)=>{
          return <Button key={index} onclick={()=>{setOpenMenu? setOpenMenu(false): ""; setActivePageAdmin(item.id)}} css={activePageAdmin == item.id? 'bg-blue-900 hover:bg-blue-800': 'bg-gray-700 hover:bg-gray-800'}>
            {item.icon}
            <span>{item.label}</span>
          </Button>
        })
      }

    </div>
  )
}

const Button = ({ children, onclick, css = '' }) => {
  return <div>
    <button className={` w-[90%] text-start py-4 text-xl font-semibold rounded-xl hover:scale-110 transition-all duration-300 active:scale-95 flex items-center gap-2 px-3 my-5 cursor-pointer ${css}`} onClick={onclick}>{children}</button>
  </div>
}


export default Sidebar
