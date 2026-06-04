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
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../../context/UserContext'

const VendorNavbar = () => {
    const navigate = useNavigate()
    const { userdata } = React.useContext(userDataContext)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className='fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-2xl border-b border-gray-700 z-50 backdrop-blur-sm'
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
                                <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300'></div>
                                <img 
                                    className='w-14 h-14 rounded-full object-cover relative z-10 border-2 border-blue-500 group-hover:border-purple-500 transition-all duration-300' 
                                    src={logo} 
                                    alt="Logo" 
                                />
                            </div>
                            <div className='hidden md:block'>
                                <motion.h1 
                                    className='text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'
                                    animate={{ 
                                        backgroundPosition: ['0%', '100%', '0%'],
                                    }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    style={{ backgroundSize: '200%' }}
                                >
                                    MY CART
                                </motion.h1>
                                <p className='text-xs text-gray-400'>Vendor Dashboard</p>
                            </div>
                        </motion.div>

                        {/* Center Title - Desktop */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className='hidden lg:block absolute left-1/2 transform -translate-x-1/2'
                        >
                            <h2 className='text-xl font-semibold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent'>
                                Welcome {userdata?.fullName?.split(' ')[0] || 'Vendor'}!
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
                                <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300'></div>
                                <div className='relative p-2.5 rounded-full bg-gray-800 text-gray-300 group-hover:text-white group-hover:bg-gray-700 transition-all duration-300'>
                                    <RiCustomerServiceFill className='text-2xl' />
                                </div>
                            </motion.button>

                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className='relative group cursor-pointer hidden md:block'
                                onClick={() => navigate('/update-vendor-details')}
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300'></div>
                                <div className='relative border-2 border-gray-600 rounded-full overflow-hidden group-hover:border-blue-500 transition-all duration-300'>
                                    <Avatar 
                                        name={userdata?.fullName} 
                                        src={userdata?.avatar} 
                                        size={45}
                                    />
                                </div>
                            </motion.div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className='md:hidden relative p-2 rounded-full bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300'
                            >
                                {isMobileMenuOpen ? <ImCross className='text-lg' /> : <GiHamburgerMenu className='text-2xl' />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className='fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden'
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        
                        <motion.div
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className='fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-gray-900 to-gray-800 z-50 shadow-2xl md:hidden'
                        >
                            <div className='p-6 h-full flex flex-col'>
                                <div className='flex items-center gap-3 mb-8 pb-4 border-b border-gray-700'>
                                    <div className='relative'>
                                        <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md'></div>
                                        <img className='w-14 h-14 rounded-full object-cover relative z-10 border-2 border-blue-500' src={logo} alt="Logo" />
                                    </div>
                                    <div className='flex-1'>
                                        <h2 className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                                            MyCart
                                        </h2>
                                        <p className='text-xs text-gray-400'>Vendor Panel</p>
                                    </div>
                                    <button 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className='p-2 rounded-full bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 transition-all'
                                    >
                                        <ImCross className='text-sm' />
                                    </button>
                                </div>
                                
                                <div className='flex-1'>
                                    <div className='mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20'>
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
                                </div>
                                
                                <div className='pt-4 border-t border-gray-700'>
                                    <button
                                        onClick={() => {
                                            navigate('/update-vendor-details')
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className='w-full mb-3 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95'
                                    >
                                        Profile Settings
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/support')
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className='w-full py-3 bg-gray-700 rounded-xl font-semibold text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2'
                                    >
                                        <RiCustomerServiceFill className='text-xl' />
                                        Support
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

const Icon = ({ icon, onClick, css = '' }) => {
    return (
        <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className={`${css} text-3xl bg-gradient-to-r from-gray-600 to-gray-700 rounded-full p-2 cursor-pointer hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-blue-500/30 transition-all duration-300`} 
            onClick={onClick}
        >
            {icon}
        </motion.div>
    )
}

export default VendorNavbar