import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import { IoSearchSharp } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { BsCartCheckFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { MdAddPhotoAlternate } from "react-icons/md";
import { LuSquareMenu } from "react-icons/lu";
import axios from 'axios';

import { Avatar } from '../../context/UserContext';

import { useFetcher, useNavigate } from 'react-router-dom';
import { userDataContext } from '../../context/UserContext'
import Sidebar from './Sidebar'




const AdminNavbar = ({ activePageAdmin, setActivePageAdmin }) => {
    const [openProfile, setOpenProfile] = useState()
    const [openMenu, setOpenMenu] = useState(false)
    const [error, setError] = useState(null)
    const [selectedAvatar, setSelectedAvatar] = useState('')
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData } = React.useContext(userDataContext)
    const profileRef = useRef()
    const menuRef = useRef()
    const logoRef = useRef()
    const avatarRef = useRef()
    const [avatar, setAvatar] = useState()
    const [formData, setFormData] = useState({
        loginKey: "",
        phone: "",
        password: "",
        fullName: ""
    })
    const completion = 10;



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

    useEffect(() => {
        if (userdata) {
            setFormData(pre => ({
                ...pre,
                loginKey: userdata.username || "",
                phone: userdata.phone || "",
                fullName: userdata.fullName || "",
            }))
        }
    }, [userdata])


    return (
        <AnimatePresence>
            <motion.div key='nav'
                initial={{ x: 400, opacity: 0, scale: 0 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -200, opacity: 0, scale: 0 }}
                transition={{ duration: .6, ease: "easeOut", type: "tween" }}
                className='bg-black h-20 w-full absolute top-0 shadow-2xl hover:shadow-blue-700 text-white flex items-center justify-between px-1 md:px-3 z-10'>
                <div className='border-white border-4 rounded-full cursor-pointer' onClick={() => navigate('/')}>
                    <Avatar name="WebMind" src={logo} size={70} />
                </div>
                <h1 className='text-lg md:text-6xl font-black bg-linear-to-r from-red-500 via-purple-500 to-blue-500 bg-cover bg-center  select-none text-transparent [-webkit-text-fill-color:transparent] bg-clip-text [-webkit-background-clip:text]'>WELCOME TO MY CART</h1>
                <div className='flex items-center justify-center gap-5'>
                    <Icon icon={<RiCustomerServiceFill onClick={() => navigate('/support')} />} />
                    <div ref={logoRef} className='border-white border-2 rounded-full cursor-pointer hidden md:block' onClick={() => setOpenProfile((pre) => !pre)}>
                        <Avatar name={userdata?.fullName} src={userdata?.avatar} />
                    </div>
                    <Icon icon={openMenu ? <ImCross /> : <LuSquareMenu />} onClick={() => setOpenMenu(pre => !pre)} css='md:hidden' />
                </div>

                {
                    openProfile && <motion.div ref={profileRef} key='modal'
                        initial={{ scale: 0, opacity: 0, y: -400 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, x: 400 }}
                        transition={{ duration: .6, ease: "easeOut", type: "tween" }}
                        className='bg-gray-800 md:bg-gray-800/80 absolute top-38 md:top-20 right-10 md:right-0 rounded-4xl  md:rounded-none md:rounded-bl-4xl flex flex-col gap-2 p-5 z-20'>
                        <div className='text-center relative flex justify-around'>
                            <input ref={avatarRef} type="file" accept='image/*' onChange={(e) => { setAvatar(e.target.files[0]); setSelectedAvatar(URL.createObjectURL(e.target.files[0])) }} className='hidden' />
                            <div className='border-white border-2 rounded-full cursor-pointer' onClick={() => avatarRef.current.click()}>
                                {selectedAvatar ?
                                    <img src={selectedAvatar} alt="profile" className='object-cover h-16 w-16 rounded-full border-2 border-black cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500' />
                                    : <Avatar name={userdata?.fullName} src={userdata?.avatar} size={58} />
                                }
                            </div>
                            <MdAddPhotoAlternate onClick={() => avatarRef.current.click()} className='absolute bottom-2 left-16 text-3xl cursor-pointer' />
                            <Button text='Update Avatar' onClick={handleAvatar} css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' />
                        </div>
                        <div className='flex items-center gap-2'> 0% <h1 className='h-2 w-full bg-white relative rounded-full'><p style={{ width: `${completion}%` }} className='h-2 bg-blue-800 rounded-full absolute top-0 left-0'></p></h1> 100% </div>
                        <p className='text-center'>Your profile {completion}% complete</p>

                        <div>
                            <p>Enter Your Username or EmailId</p>
                            <input required disabled type="text" name='loginKey' onChange={handleChange} value={formData.loginKey} placeholder='Enter Your Username or EmailId' className='w-80 h-10 rounded-full outline-none border-4 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-5 hover:border-4 hover:border-black transition-all duration-500' />
                        </div>
                        <div>
                            <p>Enter Your Full Name</p>
                            <input required type="text" name='fullName' onChange={handleChange} value={formData.fullName} placeholder='Enter Your Name' className='w-80 h-10 rounded-full outline-none border-4 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-5 hover:border-4 hover:border-black transition-all duration-500' />
                        </div>

                        <div>
                            <p>Enter Your Phone Number</p>
                            <input type="text" name='phone' onChange={handleChange} value={formData.phone} placeholder='Enter Your Phone Number' className='w-80 h-10 rounded-full outline-none border-4 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-5 hover:border-4 hover:border-black transition-all duration-500' />
                        </div>
                        <div>
                            <p>Enter Your Password</p>
                            <input required type="text" name='password' onChange={handleChange} placeholder='Enter Your Password' className='w-80 h-10 rounded-full outline-none border-4 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-5 hover:border-4 hover:border-black transition-all duration-500' />
                        </div>
                        <Button text='Update Details' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' onClick={handleUpdate} />
                        <Button text='Logout' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' onClick={handleLogOut} />

                    </motion.div>
                }
                {
                    openMenu && <motion.div key='menu' ref={menuRef}
                        initial={{ scale: 0, opacity: 0, x: 100 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, }}
                        transition={{ duration: .6, ease: "easeOut", type: "tween" }}
                        className='bg-gray-800 md:bg-gray-800/80 rounded-4xl py-5 z-10 absolute top-20 text-center flex flex-col items-center w-screen md:hidden'>

                        <Sidebar setOpenMenu={setOpenMenu} activePageAdmin={activePageAdmin} setActivePageAdmin={setActivePageAdmin} css='md:hidden w-[80vw]' />
                        <Button text='Update Avatar' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 w-[80%] my-3' onClick={() => setOpenProfile(true)} />

                    </motion.div>
                }
            </motion.div>

        </AnimatePresence>
    )
}

const Button = ({ text, onClick, css = '' }) => {
    return (

        <button className={`${css} bg-gray-500 p-1 px-3 rounded-full cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500`} onClick={onClick}>{text}</button>

    )
}
const Icon = ({ icon, onClick, css = '' }) => {
    return <div className={`${css} text-3xl bg-gray-500 rounded-full p-2 cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500`} onClick={onClick}>
        {icon}
    </div>
}

export default AdminNavbar
