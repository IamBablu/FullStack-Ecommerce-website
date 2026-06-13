import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import { IoSearchSharp } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { BsCartCheckFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { MdAddPhotoAlternate, MdLogout, MdSettings, MdPerson, MdEmail, MdPhone, MdLock } from "react-icons/md";
import { LuSquareMenu } from "react-icons/lu";
import { FaUserCircle, FaStore, FaClipboardList, FaChartLine, FaCrown } from "react-icons/fa";
import axios from 'axios';

import { Avatar } from '../../context/UserContext';

import { useFetcher, useNavigate } from 'react-router-dom';
import { userDataContext } from '../../context/UserContext'
import Sidebar from './Sidebar'
import { div } from 'motion/react-client';

const AdminNavbar = () => {
    const [openProfile, setOpenProfile] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [error, setError] = useState(null)
    const [selectedAvatar, setSelectedAvatar] = useState('')
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData, activePage, setActivePage } = React.useContext(userDataContext)
    const profileRef = useRef()
    const menuRef = useRef()
    const logoRef = useRef()
    const avatarRef = useRef()
    const [avatar, setAvatar] = useState()
    const [completion, setCompletion] = useState(0)
    const [formData, setFormData] = useState({
        loginKey: "",
        phone: "",
        password: "",
        fullName: ""
    })

    useEffect((e) => {
        const handleClickOutside = (event) => {
            if (openProfile && profileRef.current && !profileRef.current.contains(event.target) && !logoRef.current.contains(event.target)) {
                setOpenProfile(false)
            }
            if (openMenu && menuRef.current && !menuRef.current.contains(event.target) && !logoRef.current.contains(event.target)) {
                setOpenMenu(false)
            }
            event.stopPropagation()
        };
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [openProfile, openMenu])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(pre => ({
            ...pre,
            [name]: value
        }))
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.patch(`${serverUrl}/users/update-user`, formData, { withCredentials: true })
        } catch (error) {
            console.error(error.message)
            setError(error)
        }
    }

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/users/signout`, { withCredentials: true })
            setUserData(null)
            navigate("/login")
        } catch (error) {
            console.error(error)
        }
    }

    const handleAvatar = async (e) => {
        e.preventDefault();
        try {
            if (avatar) {
                const formData = new FormData()
                formData.append('avatar', avatar)
                const result = await axios.patch(`${serverUrl}/users/update-avatar`, formData, { withCredentials: true })
                setUserData(result.data.data)
                navigate('/')
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleFileSelect= (e)=> {
        const file = e.target.files[0];
        if(file){
            setAvatar(file)
            const previewUrl = URL.createObjectURL(file)
            setSelectedAvatar(previewUrl)
        }
    }

    useEffect(() => {
        setActivePage("dashboard")
        setCompletion(0)
        console.log(userdata)
        if (userdata) {
            setFormData(pre => ({
                ...pre,
                loginKey: userdata.username || "",
                phone: userdata.phone || "",
                fullName: userdata.fullName || "",
            }))
        }

        if (userdata?.username) setCompletion(pre => pre + 16);
        if (userdata?.email) setCompletion(pre => pre + 16);
        if (userdata?.fullName) setCompletion(pre => pre + 16);
        if (userdata?.phone) setCompletion(pre => pre + 16);
        if (userdata?.avatar) setCompletion(pre => pre + 16);
        if (userdata?.role) setCompletion(pre => pre + 16);
        if (
            userdata?.username &&
             userdata?.email &&
              userdata?.fullName &&
               userdata?.phone &&
            userdata?.avatar &&
            userdata?.role) setCompletion(pre => pre + 4);
    }, [userdata])

    return (
        <motion.div key='nav'
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className='fixed top-0 left-0 right-0 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-gray-700 z-50 backdrop-blur-sm'
        >
            <div className='container mx-auto px-4'>
                <div className='flex items-center justify-between h-20'>
                    {/* Logo Section */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='flex items-center gap-3 cursor-pointer group'
                        onClick={() => navigate('/')}
                    >
                        <div className='relative'>
                            <div className='absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300'></div>
                            <div className='relative border-4 border-transparent group-hover:border-blue-500 rounded-full transition-all duration-300'>
                                <Avatar name="WebMind" src={logo} size={55} />
                            </div>
                        </div>
                        <div>
                            <motion.h1
                                className='text-xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
                                animate={{
                                    backgroundPosition: ['0%', '100%', '0%'],
                                }}
                                transition={{ duration: 5, repeat: Infinity }}
                                style={{ backgroundSize: '200%' }}
                            >
                                Admin Panel
                            </motion.h1>
                            <p className='text-xs text-gray-400'>MyCart Dashboard</p>
                        </div>
                    </motion.div>

                    {/* Center Title */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className='hidden lg:block absolute left-1/2 transform -translate-x-1/2'
                    >
                        <h2 className='text-2xl font-black bg-linear-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent'>
                            WELCOME TO MY CART
                        </h2>
                    </motion.div>

                    {/* Right Section */}
                    <div className='flex items-center gap-3'>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className='relative group'
                            onClick={() => navigate('/support')}
                        >
                            <div className='absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300'></div>
                            <div className='relative p-2.5 rounded-full bg-gray-800 text-gray-300 group-hover:text-white group-hover:bg-gray-700 transition-all duration-300'>
                                <RiCustomerServiceFill className='text-2xl' />
                            </div>
                        </motion.button>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='relative group cursor-pointer hidden md:block'
                            ref={logoRef}
                            onClick={() => setOpenProfile((pre) => !pre)}
                        >
                            <div className='absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300'></div>
                            <div className='relative border-2 border-gray-600 rounded-full overflow-hidden group-hover:border-blue-500 transition-all duration-300'>
                                <Avatar name={userdata?.fullName} src={userdata?.avatar} size={45} />
                            </div>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setOpenMenu(pre => !pre)}
                            className='md:hidden relative p-2.5 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300'
                        >
                            {openMenu ? <ImCross className='text-lg' /> : <LuSquareMenu className='text-2xl' />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Profile Dropdown */}
            <AnimatePresence>
                {openProfile && (
                    <motion.div
                        ref={profileRef}
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className='absolute top-20 right-0 w-full md:right-4 md:w-96 bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden z-20'
                    >
                        {/* Header with Avatar */}
                        <div className='relative bg-linear-to-r from-blue-600 to-purple-600 px-6 pt-8 md:pt-2 pb-12 md:pb-2 text-center'>
                            <div className='absolute inset-0 bg-black/20'></div>
                            <div className='relative z-10'>
                                <div className='flex justify-center mb-3'>
                                    <div className='relative group cursor-pointer' onClick={() => avatarRef.current.click()}>
                                        <div className='border-4 border-white rounded-full shadow-xl'>
                                            {selectedAvatar ?
                                                <img src={selectedAvatar} alt="profile" className='object-cover h-20 w-20 rounded-full' />
                                                : <Avatar name={userdata?.fullName} src={userdata?.avatar} size={80} />
                                            }
                                        </div>
                                        <div className='absolute bottom-0 right-0 p-1.5 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors'>
                                            <MdAddPhotoAlternate className='text-white text-sm' />
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        ref={avatarRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <h3 className='text-white font-semibold text-lg'>{userdata?.fullName || 'Admin User'}</h3>
                                <p className='text-blue-200 text-sm'>Administrator</p>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className='p-5 space-y-4 md:max-h-96 overflow-y-auto custom-scrollbar'>
                            {/* Completion Progress */}
                            <div className='bg-gray-700/30 rounded-xl p-3'>
                                <div className='flex justify-between text-sm mb-2'>
                                    <span className='text-gray-300'>Profile Completion</span>
                                    <span className='text-blue-400 font-semibold'>{completion}%</span>
                                </div>
                                <div className='h-2 bg-gray-600 rounded-full overflow-hidden'>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completion}%` }}
                                        transition={{ duration: 1 }}
                                        className='h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full'
                                    />
                                </div>
                            </div>

                            {/* Update Avatar Button */}
                            <button
                                onClick={handleAvatar}
                                className='cursor-pointer w-full py-2 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl font-medium text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95'
                            >
                                Update Avatar
                            </button>

                            {/* Form Fields */}
                            <div className='space-y-3'>
                                <div>
                                    <label className='text-gray-400 text-sm flex items-center gap-2 mb-1'>
                                        <MdEmail className='text-blue-400' />
                                        Username / Email
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        name='loginKey'
                                        onChange={handleChange}
                                        value={formData.loginKey}
                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all cursor-not-allowed opacity-70'
                                    />
                                </div>

                                <div>
                                    <label className='text-gray-400 text-sm flex items-center gap-2 mb-1'>
                                        <MdPerson className='text-blue-400' />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name='fullName'
                                        onChange={handleChange}
                                        value={formData.fullName}
                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                    />
                                </div>

                                <div>
                                    <label className='text-gray-400 text-sm flex items-center gap-2 mb-1'>
                                        <MdPhone className='text-blue-400' />
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        name='phone'
                                        onChange={handleChange}
                                        value={formData.phone}
                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                    />
                                </div>

                                <div>
                                    <label className='text-gray-400 text-sm flex items-center gap-2 mb-1'>
                                        <MdLock className='text-blue-400' />
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name='password'
                                        onChange={handleChange}
                                        placeholder='Enter new password'
                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-3 pt-2'>
                                <button
                                    onClick={handleUpdate}
                                    className='flex-1 py-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95'
                                >
                                    Update Details
                                </button>
                                <button
                                    onClick={handleLogOut}
                                    className='flex-1 py-2 bg-red-600/20 border border-red-600 rounded-xl font-medium text-red-400 hover:bg-red-600/30 transition-all duration-300 flex items-center justify-center gap-2'
                                >
                                    <MdLogout />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Mobile Menu */}
            <AnimatePresence>
                {openMenu && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className='absolute top-20 right-0 w-screen bg-linear-to-b from-gray-900 to-gray-800 shadow-2xl z-50 md:hidden overflow-y-auto'
                    >
                        <div className='p-6'>
                            <div className='bg-gray-900 pl-5 pt-3'>
                                <div className='mb-2 w-[90%] p-4 bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20'>
                                    <div className='flex items-center gap-3'>
                                        <div className='border-2 border-blue-500 rounded-full'>
                                            <Avatar
                                                name={userdata?.fullName}
                                                src={userdata?.avatar}
                                                size={50}
                                            />
                                        </div>
                                        <div>
                                            <p className='font-semibold text-white text-lg'>{userdata?.fullName || 'Vendor'}</p>
                                            <p className='text-xs text-gray-400'>{userdata?.email || 'vendor@mycart.com'}</p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setOpenProfile(true)
                                        setOpenMenu(false)
                                    }}
                                    className='w-[90%] mt-4 py-3 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl font-medium text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300'
                                >
                                    Update Details
                                </button>
                            </div>
                            <Sidebar
                                setActivePage={setActivePage}
                                setOpenMenu={setOpenMenu}
                                css='w-full'
                            />

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>

    );
}

const Button = ({ text, onClick, css = '' }) => {
    return (
        <button className={`${css} bg-gray-500 p-1 px-3 rounded-full cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500`} onClick={onClick}>
            {text}
        </button>
    )
}

const Icon = ({ icon, onClick, css = '' }) => {
    return (
        <div className={`${css} text-3xl bg-gray-500 rounded-full p-2 cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500`} onClick={onClick}>
            {icon}
        </div>
    )
}

export default AdminNavbar