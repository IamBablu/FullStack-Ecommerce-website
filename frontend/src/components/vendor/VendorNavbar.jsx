import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import { IoSearchSharp } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { BsCartCheckFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import axios from 'axios';
import { Avatar } from '../../context/UserContext';


import { useFetcher, useNavigate } from 'react-router-dom';
import { userDataContext } from '../../context/UserContext'




const VendorNavbar = () => {
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData} = React.useContext(userDataContext)

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/users/signout`, { withCredentials: true })
            setUserData(null)
            navigate("/login")
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <motion.div key='nav'
            initial={{ x: 400, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -200, opacity: 0, scale: 0 }}
            transition={{ duration: .6, ease: "easeOut", type: "tween" }}
            className='bg-black h-20 w-full absolute top-0 shadow-2xl hover:shadow-blue-700 text-white flex items-center justify-between px-1 md:px-3 z-10'>

            <Avatar name="WebMind" src={logo} size={70} />
            <h1 className='text-6xl font-black bg-linear-to-r from-red-500 via-purple-500 to-blue-500 bg-cover bg-center  select-none text-transparent [-webkit-text-fill-color:transparent] bg-clip-text [-webkit-background-clip:text]'>WELCOME TO MY CART</h1>
            <div className='flex items-center justify-center gap-5'>
                <Icon icon={<RiCustomerServiceFill onClick={() => navigate('/support')} />} />
                <div className='border-white border-2 rounded-full cursor-pointer hidden md:block' onClick={() => navigate('/update-vendor-details')}>
                    <Avatar name={userdata?.fullName} src={userdata?.avatar} />
                </div>
            </div>
        </motion.div>


    )
}

const Icon = ({ icon, onClick, css = '' }) => {
    return <div className={`${css} text-3xl bg-gray-500 rounded-full p-2 cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500`} onClick={onClick}>
        {icon}
    </div>
}

export default VendorNavbar
