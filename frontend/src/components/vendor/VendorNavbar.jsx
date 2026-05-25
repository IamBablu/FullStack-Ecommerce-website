import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import image11 from '../../assets/images11.jpg'
import { IoSearchSharp } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { BsCartCheckFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import axios from 'axios';

import { useFetcher, useNavigate } from 'react-router-dom';
import { userDataContext } from '../../context/UserContext'




const VendorNavbar = () => {
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData} = React.useContext(userDataContext)

    const handleLogOut = async () => {
        try {
            await axios.get('http://127.0.0.1:8000/api/v1/users/signout', { withCredentials: true })
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

            <img src={logo} alt="logo" className='object-cover h-20 w-20 hover:border-white rounded-full border-2 border-blue-600 cursor-pointer transition-all duration-300' onClick={() => navigate('/')} />
            <h1 style={{ backgroundImage: `url(${image11})` }} className='text-white text-6xl font-black bg-cover bg-center  select-none text-transparent [-webkit-text-fill-color:transparent] bg-clip-text [-webkit-background-clip:text]'>WELCOME TO MY CART</h1>
            <div className='flex items-center justify-center gap-5'>
                <Icon icon={<RiCustomerServiceFill onClick={() => navigate('/support')} />} />
                <img src={logo} alt="profile" onClick={() => navigate('/update-vendor-details')} className='hidden md:block object-cover h-12 w-12 rounded-full border-2 border-blue-600 cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500' />
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
