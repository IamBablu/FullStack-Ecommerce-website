import React, { useState } from 'react'
import axios from 'axios';
import { motion } from 'motion/react'
import logo from '../../assets/logo.jpeg'
import { MdAddPhotoAlternate } from "react-icons/md";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";

const UpdateVendorDetails = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        loginKey: "",
        password: "",
        fullName: "",
        shopName: "",
        shopAddress: "",
        gstNumber: "",
    })

    const handleChange = () => {
        console.log("changing....")
    }
    const handleUpdate = () => {
        console.log("Update....")
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
    return (
        <div className='text-white h-[100vh] w-full bg-gradient-to-b from-blue-950 to-black flex justify-center items-center relative'>

            <motion.div
                initial={{ scale: 0, opacity: 0, y: 200 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className='w-[370px]  bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-4 '>
                <div className='text-center relative flex justify-around items-center gap-7'>
                    <img src={logo} alt="profile" className='object-cover h-16 w-16 rounded-full border-2 border-black cursor-pointer hover:bg-gray-800 shadow-sm hover:shadow-blue-700 transition-all duration-500' />
                    <MdAddPhotoAlternate className='absolute bottom-2 left-10 text-3xl cursor-pointer' />
                    <Button text='Update Avatar' css='h-10 bg-green-700 transition-transform duration-150 active:scale-95 hover:scale-105' />
                </div>

                {error && <p className='text-red-600'>{error}</p>}
                <form className='flex flex-col gap-2' onSubmit={handleUpdate}>

                    <div className=' h-[355px] overflow-y-auto /* 1. Set the width */
            [&::-webkit-scrollbar]:w-1.5
            
            /* 2. Track (Background) - Keep it dark/subtle */
            [&::-webkit-scrollbar-track]:bg-slate-900
            
            /* 3. Thumb (The handle) - Make it stand out */
            [&::-webkit-scrollbar-thumb]:bg-slate-700
            [&::-webkit-scrollbar-thumb]:rounded-full
            
            /* 4. Hover effect for the handle */
            hover:[&::-webkit-scrollbar-thumb]:bg-blue-500
            active:[&::-webkit-scrollbar-thumb]:bg-blue-400">'>
                        <p className='text-lg '>Enter Your Full Name</p>
                        <input required type="text" name='fullName' onChange={handleChange} placeholder='Enter Your Name' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                        <p className='text-lg '>Enter Your Username</p>
                        <input required type="text" name='loginKey' onChange={handleChange} placeholder='Enter Your UserName or EmailId' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                        <p className='text-lg '>Enter Your Password</p>
                        <div className='relative'>
                            <input required type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} placeholder='Enter Your Password' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                            {!showPassword ? (<FaEye className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(true)} />) : (<FaEyeSlash className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(false)} />)}
                        </div>

                        <div>
                            <p className='text-lg '>Enter Your Shop Name</p>
                            <input required type="text" name='shopName' onChange={handleChange} placeholder='Enter Your Shop Name' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                            <p className='text-lg '>Enter Your Shop Address</p>
                            <input required type="text" name='shopAddress' onChange={handleChange} placeholder='Enter Your Shop Address' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                            <p className='text-lg '>Enter Your Gst Number</p>
                            <input required type="text" name='gstNumber' onChange={handleChange} placeholder='Enter Your Gst Number' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
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
