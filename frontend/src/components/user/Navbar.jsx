import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import { IoSearchSharp } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { BsCartCheckFill } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { MdAddPhotoAlternate } from "react-icons/md";
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
    const { userdata, setUserData, cart, setCart } = React.useContext(userDataContext)

    const completion = 10;
    const [formData, setFormData] = useState({
        loginKey: "",
        password: "",
        fullName: "",
        phone: ""
    })

    const handleChange = () => {

    }

    const handleUpdate = () => {

    }


    console.log("This is cart", cart)

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check for Mobile Menu outside click
            if (openMenu && menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false)
            }
            // Check for Profile Modal outside click
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


    const handleHome = () => {
        console.log("Clicked")
    }
    const handleCategories = () => {
        console.log("Categories")
    }
    const handleShop = () => {
        console.log("Shope")
    }
    const handleOrders = () => {
        console.log("Orders.")
    }
    const handleSearch = () => {
        console.log("Searching....")
    }
    const handleProfile = (e) => {
        console.log(userdata)
        if (!userdata) navigate('/login')
        console.log("Profile section")
        e.stopPropagation()
        setOpenProfile((pre) => !pre)
        console.log("Profile section2")
    }


    const handleLogOut = async () => {
        try {
            console.log("clicked...")
            await axios.get('http://127.0.0.1:8000/api/v1/users/signout', { withCredentials: true })
            console.log("clicked...1")
            setUserData(null)
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const getCartSet = () => {
        console.log("cartsetting : ", userdata?.data.cart )
        setCart(userdata?.data.cart)
    }
    console.log("bablucart: ",cart);
    useEffect(() => {
    getCartSet();
}, [userdata, setCart]);
    return (
        <motion.div key='nav'
            initial={{ x: 400, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -200, opacity: 0, scale: 0 }}
            transition={{ duration: .6, ease: "easeOut", type: "tween" }}
            className='bg-black h-20 w-full absolute top-0 shadow-2xl hover:shadow-blue-700 text-white flex items-center justify-between px-1 md:px-3 z-10 sticky'>

            <img src={logo} alt="logo" className='object-cover h-20 w-20 hover:border-white rounded-full border-2 border-blue-600 cursor-pointer transition-all duration-300' onClick={() => navigate('/')} />

            <div className='hidden md:flex items-center justify-center gap-5'>
                <Button text='Home' onClick={handleHome} />
                <Button text='Categories' onClick={handleCategories} />
                <Button text='Shop' onClick={handleShop} />
                <Button text='Orders' onClick={handleOrders} />
            </div>
            <div className='flex items-center justify-center gap-5'>
                <Icon icon={<IoSearchSharp />} onClick={handleSearch} />
                <Icon icon={<RiCustomerServiceFill onClick={() => navigate('/support')} />} />
                <img ref={logoRef} src={logo} alt="profile" onClick={handleProfile} className='hidden md:block object-cover h-12 w-12 rounded-full border-2 border-blue-600 cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500' />
                <div className='relative'>
                    <Icon icon={<BsCartCheckFill onClick={()=>navigate('/cart-page')} />} />
                    <p className='bg-blue-700 h-6 w-6 rounded-full absolute top-0 right-0 text-center cursor-pointer' onClick={()=>navigate('/cart-page')}>{cart?.length}</p>
                </div>
                <Icon icon={openMenu ? <ImCross /> : <GiHamburgerMenu />} css='md:hidden' onClick={() => setOpenMenu((pre) => !pre)} />

            </div>
            {openMenu && <div ref={menuRef} className='md:hidden absolute top-20 right-0 flex flex-col gap-2 h-[calc(100vh-5rem)] bg-gray-600/60 px-4 z-10'>

                <div ref={logoRef}
                    className='bg-gray-500 p-1 px-3 rounded-full cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500 flex items-center py-4 h-18'
                    onClick={handleProfile}>
                    <img src={logo} alt="profile" className='object-cover h-16 w-16 rounded-full border-2 border-blue-600 cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500' />
                    <span className='text-center text-3xl font-semibold mx-2'>Profile</span>
                </div>
                <Button text='Categories' onClick={handleCategories} css='text-3xl py-4 font-semibold text-start px-10' />
                <Button text='Shop' onClick={handleShop} css='text-3xl py-4 font-semibold text-start px-10' />
                <Button text='Orders' onClick={handleOrders} css='text-3xl py-4 font-semibold text-start px-10' />
                <Button text={userdata ? 'LogOut' : 'Login'} onClick={() => userdata ? handleLogOut : navigate('/login')} css='text-3xl py-4 font-semibold text-start px-10' />
            </div>}
            {userdata && openProfile && <motion.div ref={profileRef} key='modal'
                initial={{ scale: 0, opacity: 0, y: -400 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, x: 400 }}
                transition={{ duration: .6, ease: "easeOut", type: "tween" }}
                className='bg-gray-800 md:bg-gray-800/80 absolute top-38 md:top-20 right-10 md:right-0 rounded-4xl  md:rounded-none md:rounded-bl-4xl flex flex-col gap-2 p-5 z-10'>
                <div className='text-center relative flex justify-around'>
                    <img src={logo} alt="profile" className='object-cover h-16 w-16 rounded-full border-2 border-black cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500' />
                    <MdAddPhotoAlternate className='absolute bottom-2 left-16 text-3xl cursor-pointer' />
                    <Button text='Update Avatar' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' />
                </div>
                <div className='flex items-center gap-2'> 0% <h1 className='h-2 w-full bg-white relative rounded-full'><p style={{ width: `${completion}%` }} className='h-2 bg-blue-800 rounded-full absolute top-0 left-0'></p></h1> 100% </div>
                <p className='text-center'>Your profile {completion}% complete</p>

                <div>
                    <p>Enter Your Username or EmailId</p>
                    <input type="text" name='loginKey' onChange={handleChange} placeholder='Enter Your Username or EmailId' className='w-[300px] h-[40px] rounded-full outline-none border-4 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-black transition-all duration-500' />
                </div>
                <div>
                    <p>Enter Your Full Name</p>
                    <input type="text" name='fullName' onChange={handleChange} placeholder='Enter Your Name' className='w-[300px] h-[40px] rounded-full outline-none border-4 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-black transition-all duration-500' />
                </div>

                <div>
                    <p>Enter Your Phone Number</p>
                    <input type="text" name='phone' onChange={handleChange} placeholder='Enter Your Phone Number' className='w-[300px] h-[40px] rounded-full outline-none border-4 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-black transition-all duration-500' />
                </div>
                <div>
                    <p>Enter Your Password</p>
                    <input type="text" name='password' onChange={handleChange} placeholder='Enter Your Password' className='w-[300px] h-[40px] rounded-full outline-none border-4 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-black transition-all duration-500' />
                </div>
                <Button text='Update Details' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' onClick={handleUpdate} />
                <Button text='Logout' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' onClick={handleLogOut} />

            </motion.div>}
        </motion.div>


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
export default Navbar
