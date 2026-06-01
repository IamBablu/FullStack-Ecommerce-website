import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../../context/UserContext';
import { motion } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoArrowBackSharp } from "react-icons/io5";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

const UpdateVendorDetails = () => {
    const {serverUrl, userdata, setUserData} = React.useContext(userDataContext)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        loginKey: "",
        phone: "",
        password: "",
        fullName: "",
        shopName: "",
        shopAddress: "",
        gstNumber: "",
    })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setError("")
        const {name, value} = e.target;
        setFormData(pre=> ({
            ...pre,
            [name]: value
        }))
    }
    const handleUpdate = async(e) => {
        e.preventDefault();
        try {
            const result = await axios.patch(`${serverUrl}/users/update-user`, formData ,{withCredentials: true})
            setUserData(result.data)
            navigate('/')
        } catch (error) {
            console.error(error.message)
            setError(error)
        }
    }
    const handleLogOut = async () => {
        try {
            await axios.get('http://127.0.0.1:8000/api/v1/users/signout', { withCredentials: true })
            setUserData(null)
            navigate("/login")
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
        if(userdata?.data){
        setFormData(pre=>({
        ...pre,
        loginKey: userdata.data.username || "",
        phone: userdata.data.phone || "",
        fullName: userdata.data.fullName || "",
        shopName: userdata.data.shopName || "",
        shopAddress: userdata.data.shopAddress || "",
        gstNumber: userdata.data.gstNumber || "",

        }))
    }
    },[userdata])


    return (
        <div className='text-white h-screen w-full bg-linear-to-b from-blue-950 to-black flex justify-center items-center relative'>

            <motion.div
                initial={{ scale: 0, opacity: 0, y: 200 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className='w-92  bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-4 relative'>
                 <IoArrowBackSharp className='text-2xl absolute top-5 left-5 cursor-pointer' onClick={()=>navigate('/')}/>
                <div className='text-center relative flex justify-around items-center gap-7'>
                    <img src={logo} alt="profile" className='object-cover h-16 w-16 rounded-full border-2 border-black cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500' />
                    <MdAddPhotoAlternate className='absolute bottom-2 left-10 text-3xl cursor-pointer' />
                    <Button text='Update Avatar' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' />
                </div>

                {error && <p className='text-red-600'>{error}</p>}
                <form className='flex flex-col gap-2' onSubmit={handleUpdate}>

                    <div className='pr-2 h-88 overflow-y-auto /* 1. Set the width */
            [&::-webkit-scrollbar]:w-1.5
            
            /* 2. Track (Background) - Keep it dark/subtle */
            [&::-webkit-scrollbar-track]:bg-slate-900
            
            /* 3. Thumb (The handle) - Make it stand out */
            [&::-webkit-scrollbar-thumb]:bg-slate-700
            [&::-webkit-scrollbar-thumb]:rounded-full
            
            /* 4. Hover effect for the handle */
            hover:[&::-webkit-scrollbar-thumb]:bg-blue-500
            active:[&::-webkit-scrollbar-thumb]:bg-blue-400">'>
                        <p className='text-lg '>Enter Your Username or EmailId</p>
                        <input required disabled type="text" value={formData.loginKey} name='loginKey' onChange={handleChange} placeholder='Enter Your UserName or EmailId' className='w-80 rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                        <p className='text-lg '>Enter Your Full Name</p>
                        <input required type="text" name='fullName' value={formData.fullName} onChange={handleChange} placeholder='Enter Your Name' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                        <p className='text-lg '>Enter Your Phone Number</p>
                        <input required type="Number" name='phone' value={formData.phone} onChange={handleChange} placeholder='Enter Your Phone Number' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' />
                            <p className='text-lg '>Enter Your Shop Name</p>
                            <input required type="text" name='shopName' value={formData.shopName} onChange={handleChange} placeholder='Enter Your Shop Name' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                            <p className='text-lg '>Enter Your Shop Address</p>
                            <input required type="text" name='shopAddress' value={formData.shopAddress} onChange={handleChange} placeholder='Enter Your Shop Address' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                            <p className='text-lg '>Enter Your Gst Number</p>
                            <input required type="text" name='gstNumber' value={formData.gstNumber} onChange={handleChange} placeholder='Enter Your Gst Number' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                            <p className='text-lg '>Enter Your Password</p>
                            <div className='relative'>
                            <input required type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} placeholder='Enter Your Password' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                            {!showPassword ? (<FaEye className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(true)} />) : (<FaEyeSlash className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(false)} />)}
                            </div>
                    </div>
                    <Button type='submit' text='Update Details' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' />
                </form>
                <Button text='Logout' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105 w-full' onClick={handleLogOut} />

            </motion.div>
        </div>


    )
}

const Button = ({ text, onClick, css = '' }) => {
    return (

        <button className={`${css} bg-gray-500 p-1 px-3 rounded-full cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500`} onClick={onClick}>{text}</button>

    )
}

export default UpdateVendorDetails
