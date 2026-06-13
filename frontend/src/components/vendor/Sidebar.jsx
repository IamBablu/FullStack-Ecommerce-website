import { label } from 'motion/react-client'
import React, { useContext } from 'react'
import { MdDashboard } from "react-icons/md";
import { FaStore } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { userDataContext } from '../../context/UserContext';

const Sidebar = ({action}) => {
  const { activePage, setActivePage } = useContext(userDataContext)

  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={22} /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag size={22} /> },
    { id: "products", label: "Products", icon: <FaBox size={22} /> }
  ]


  return (
    <>
      <div className='hidden bg-gray-900 w-full h-full pl-5 pt-3 md:block'>
        <h1 className='text-2xl'>Vendor Panel</h1>
        {
          menu.map((item, index) => {
            return <Button key={index} onclick={() => setActivePage(item.id)} css={activePage == item.id ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'}>
              {item.icon}
              <span>{item.label}</span>
            </Button>
          })
        }

      </div>
      <div className='md:hidden'>
        <div className='mb-6 p-4 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20'>
        <div className='flex items-start flex-col gap-3'>
          <h1 className='text-2xl'>Vendor Panel</h1>
        {
          menu.map((item, index) => {
            return <Button key={index} onclick={() => {setActivePage(item.id); action(false)}} css={`${activePage == item.id ? 'bg-blue-900 hover:bg-blue-800' : 'bg-gray-700 hover:bg-gray-800'} min-w-60`}>
              {item.icon}
              <span>{item.label}</span>
            </Button>
          })
        }
        </div>
        </div>
      </div>
    </>
  )
}

const Button = ({ children, onclick, css = '' }) => {
  return <div>
    <button className={` w-[90%] text-start py-4 text-xl font-semibold rounded-xl hover:scale-110 transition-all duration-300 active:scale-95 flex items-center gap-2 px-3 my-5 cursor-pointer ${css}`} onClick={onclick}>{children}</button>
  </div>
}


export default Sidebar
