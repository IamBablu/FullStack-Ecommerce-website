import React, { useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import { IoSearchSharp } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { BsCartCheckFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { MdAddPhotoAlternate, MdEmail, MdPerson, MdPhone, MdLock, MdLogout, MdShoppingBag, MdCategory, MdHome, MdStore } from "react-icons/md";
import axios from 'axios';

import { useFetcher, useNavigate } from 'react-router-dom';
import { userDataContext } from '../../context/UserContext'

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false)
    const [openProfile, setOpenProfile] = useState(false)
    const menuRef = useRef(null)
    const profileRef = useRef(null)
    const logoRef = useRef(null)
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData, cart, setCart, activePage, setActivePage } = useContext(userDataContext)

    const completion = 10;
    const [formData, setFormData] = useState({
        loginKey: "",
        password: "",
        fullName: "",
        phone: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleUpdate = async () => {
        try {
            // Update logic here
            console.log("Updating...", formData)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false)
            }
            if (openProfile && profileRef.current && !profileRef.current.contains(event.target) && !logoRef.current.contains(event.target)) {
                setOpenProfile(false)
            }
            event.stopPropagation()
        };

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [openMenu, openProfile])

    const handleSearch = () => {
        console.log("Searching....")
    }

    const handleProfile = (e) => {
        if (!userdata) navigate('/login')
        e.stopPropagation()
        setOpenProfile((pre) => !pre)
    }

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/users/signout`, { withCredentials: true })
            setUserData(null)
            setCart([])
            navigate("/login")
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (userdata?.cart && cart?.length === 0) {
            setCart(userdata.cart)
        }
    }, [userdata]);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className='sticky top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-gray-700 z-50 backdrop-blur-sm'
        >
            <div className='container mx-auto px-4'>
                <div className='flex items-center justify-between h-20'>
                    {/* Logo Section */}
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='relative cursor-pointer group'
                        onClick={() => navigate('/')}
                    >
                        <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300'></div>
                        <img 
                            src={logo} 
                            alt="logo" 
                            className='relative object-cover h-16 w-16 rounded-full border-2 border-blue-500 group-hover:border-purple-500 transition-all duration-300 shadow-lg' 
                        />
                    </motion.div>

                    {/* Desktop Navigation Links */}
                    <div className='hidden md:flex items-center gap-2'>
                        <NavButton 
                            text='Home' 
                            active={activePage === 'Home'}
                            onClick={() => { navigate('/'); setActivePage("Home") }} 
                            icon={<MdHome />}
                        />
                        <NavButton 
                            text='Categories' 
                            active={activePage === 'Categories'}
                            onClick={() => { navigate('/category'); setActivePage("Categories") }} 
                            icon={<MdCategory />}
                        />
                        <NavButton 
                            text='Shop' 
                            active={activePage === 'Shop'}
                            onClick={() => { navigate('/shop'); setActivePage("Shop") }} 
                            icon={<MdStore />}
                        />
                        <NavButton 
                            text='Orders' 
                            active={activePage === 'Orders'}
                            onClick={() => { navigate('/orders'); setActivePage("Orders") }} 
                            icon={<MdShoppingBag />}
                        />
                    </div>

                    {/* Right Section */}
                    <div className='flex items-center gap-2'>
                        <Icon icon={<IoSearchSharp />} onClick={handleSearch} />
                        <Icon icon={<RiCustomerServiceFill />} onClick={() => navigate('/support')} />
                        
                        {/* Cart Icon with Badge */}
                        <div className='relative'>
                            <Icon 
                                icon={<BsCartCheckFill />} 
                                onClick={() => { userdata ? navigate('/cart-page') : navigate('/login') }} 
                            />
                            {cart?.length > 0 && (
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className='absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 h-5 w-5 rounded-full text-center text-xs text-white font-bold flex items-center justify-center shadow-lg'
                                >
                                    {cart?.length}
                                </motion.div>
                            )}
                        </div>

                        {/* Profile Avatar */}
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            ref={logoRef}
                            onClick={handleProfile}
                            className='relative group cursor-pointer hidden md:block'
                        >
                            <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300'></div>
                            <img 
                                src={logo} 
                                alt="profile" 
                                className='relative object-cover h-11 w-11 rounded-full border-2 border-gray-600 group-hover:border-blue-500 transition-all duration-300' 
                            />
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setOpenMenu((pre) => !pre)}
                            className='md:hidden relative p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300'
                        >
                            {openMenu ? <ImCross className='text-lg' /> : <GiHamburgerMenu className='text-2xl' />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {openMenu && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden'
                            onClick={() => setOpenMenu(false)}
                        />
                        <motion.div 
                            ref={menuRef}
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className='fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl z-50 md:hidden'
                        >
                            <div className='p-6 h-full flex flex-col'>
                                {/* Profile Section in Mobile Menu */}
                                <div 
                                    className='flex items-center gap-3 mb-8 pb-4 border-b border-gray-700 cursor-pointer group'
                                    onClick={handleProfile}
                                >
                                    <div className='relative'>
                                        <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity'></div>
                                        <img 
                                            src={logo} 
                                            alt="profile" 
                                            className='relative object-cover h-14 w-14 rounded-full border-2 border-blue-500' 
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <p className='font-semibold text-white text-lg'>{userdata?.fullName || 'Guest User'}</p>
                                        <p className='text-xs text-gray-400'>View Profile</p>
                                    </div>
                                </div>
                                
                                {/* Mobile Navigation Links */}
                                <div className='flex-1 space-y-2'>
                                    <MobileNavButton 
                                        text='Home' 
                                        active={activePage === 'Home'}
                                        onClick={() => { navigate('/'); setActivePage("Home"); setOpenMenu(false) }} 
                                        icon={<MdHome />}
                                    />
                                    <MobileNavButton 
                                        text='Categories' 
                                        active={activePage === 'Categories'}
                                        onClick={() => { navigate('/category'); setActivePage("Categories"); setOpenMenu(false) }} 
                                        icon={<MdCategory />}
                                    />
                                    <MobileNavButton 
                                        text='Shop' 
                                        active={activePage === 'Shop'}
                                        onClick={() => { navigate('/shop'); setActivePage("Shop"); setOpenMenu(false) }} 
                                        icon={<MdStore />}
                                    />
                                    <MobileNavButton 
                                        text='Orders' 
                                        active={activePage === 'Orders'}
                                        onClick={() => { navigate('/orders'); setActivePage("Orders"); setOpenMenu(false) }} 
                                        icon={<MdShoppingBag />}
                                    />
                                </div>
                                
                                {/* Logout Button in Mobile Menu */}
                                {userdata && (
                                    <button
                                        onClick={() => {
                                            handleLogOut();
                                            setOpenMenu(false);
                                        }}
                                        className='mt-4 w-full py-3 bg-red-600/20 border border-red-600 rounded-xl text-red-400 font-medium hover:bg-red-600/30 transition-all flex items-center justify-center gap-2'
                                    >
                                        <MdLogout />
                                        Logout
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Profile Dropdown Modal */}
            <AnimatePresence>
                {userdata && openProfile && (
                    <motion.div 
                        ref={profileRef}
                        initial={{ opacity: 0, scale: 0.9, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className='absolute top-20 right-4 w-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden z-20'
                    >
                        {/* Header with Avatar */}
                        <div className='relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 pt-8 pb-12 text-center'>
                            <div className='absolute inset-0 bg-black/20'></div>
                            <div className='relative z-10'>
                                <div className='flex justify-center mb-3'>
                                    <div className='relative group cursor-pointer'>
                                        <div className='border-4 border-white rounded-full shadow-xl'>
                                            <img 
                                                src={logo} 
                                                alt="profile" 
                                                className='object-cover h-20 w-20 rounded-full' 
                                            />
                                        </div>
                                        <div className='absolute bottom-0 right-0 p-1.5 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors'>
                                            <MdAddPhotoAlternate className='text-white text-sm' />
                                        </div>
                                    </div>
                                </div>
                                <h3 className='text-white font-semibold text-lg'>{userdata?.fullName || 'User'}</h3>
                                <p className='text-blue-200 text-sm'>{userdata?.email || 'user@example.com'}</p>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className='p-5 space-y-4 max-h-96 overflow-y-auto custom-scrollbar'>
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
                                        className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'
                                    />
                                </div>
                            </div>

                            {/* Update Avatar Button */}
                            <button className='w-full py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-medium text-white hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 active:scale-95'>
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
                                        type="text" 
                                        name='loginKey' 
                                        onChange={handleChange} 
                                        placeholder='Enter Username or Email' 
                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
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
                                        placeholder='Enter Full Name' 
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
                                        placeholder='Enter Phone Number' 
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
                                        placeholder='Enter Password' 
                                        className='w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all'
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-3 pt-2'>
                                <button
                                    onClick={handleUpdate}
                                    className='flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 active:scale-95'
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
        </motion.nav>
    )
}

// Enhanced Button Component
const Button = ({ text, onClick, css = '' }) => {
    const { activePage, setActivePage } = useContext(userDataContext)
    return (
        <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`${css} ${activePage === text ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "bg-gray-700 text-gray-300 hover:bg-gray-600"} px-4 py-2 rounded-full font-medium transition-all duration-300`} 
            onClick={onClick}
        >
            {text}
        </motion.button>
    )
}

// Enhanced Icon Component
const Icon = ({ icon, onClick, css = '' }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={`${css} p-2.5 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/30`} 
            onClick={onClick}
        >
            {icon}
        </motion.div>
    )
}

// Nav Button for Desktop
const NavButton = ({ text, active, onClick, icon }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                active 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
            <span className='text-lg'>{icon}</span>
            <span>{text}</span>
        </motion.button>
    )
}

// Mobile Nav Button
const MobileNavButton = ({ text, active, onClick, icon }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
                active 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
            }`}
        >
            <span className='text-xl'>{icon}</span>
            <span>{text}</span>
        </motion.button>
    )
}

export default Navbar