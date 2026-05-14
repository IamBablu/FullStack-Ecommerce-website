import React, { useState } from 'react'
import { motion } from "motion/react"
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import Button from '../components/button';
import Rolebox from '../components/Rolebox';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import logo from '../assets/logo.jpeg'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';





const Signup = () => {
    // To go for registration page from choose role 
    const [confirmRole, setConfirmRole] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
        role: "",
        shopName: "",
        shopAddress: "",
        gstNumber: "",
    })
    console.log(formData.role)
    console.log(formData)

    const navigate = useNavigate();

    const handleChange = (e) => {
        setError("");
        let { name, value } = e.target;
        if (name == 'email' || name == "username") value = value.toLowerCase();
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        console.log("Signup")
        try {
            const user = await axios.post('http://127.0.0.1:8000/api/v1/users/signup', formData, { withCredentials: true })

            console.log("Signup", user)
        } catch (error) {
            console.log(error)
        }
        // navigate("/login");
    }


    return (
        <div className='text-white h-[100vh] w-full bg-gradient-to-b from-blue-950 to-black flex justify-center items-center relative'>

            <div className='lg:hidden h-[100px] w-full bg-black absolute top-0 left-0 flex items-center justify-around'>
                <img className='w-[100px] h-[100px] rounded-full' src={logo} alt="" />
                <div className='text-center'>
                    <p className='text-2xl text-gray-200 font-semibold'>WellCome To</p>
                    <p className='text-2xl text-blue-400 font-semibold'> My Cart</p>
                </div>
                <div>
                    <Button text='Login' bgColor='bg-red-500 text-xl font-semibold w-[90px]' onClick={() => navigate("/login")} />
                </div>
            </div>

            {!confirmRole && <motion.div
                initial={{ scale: 0, opacity: 0, y: 200 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className='w-[370px] bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-4'>
                <h1 className='text-3xl'>Choose Your <span className='text-blue-300'>Role</span></h1>
                <div className='flex gap-4 '>
                    <Rolebox text='User'
                        isSelected={formData.role == "User"}
                        img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGWm7kgMH1PEsycRwkyqPcPB1b2NITpD8j2g&s'
                        onClick={() => setFormData({ ...formData, role: "User" })} />


                    <Rolebox text='Vendor'
                        isSelected={formData.role == "Vendor"}
                        img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkR0f_N-QMbb0JNreYa_vuG5EcprlYRshSOw&s'
                        onClick={() => setFormData({ ...formData, role: "Vendor" })} />


                    <Rolebox text='Admin'
                        isSelected={formData.role == "Admin"}
                        img='https://img.freepik.com/free-vector/business-user-cog_78370-7040.jpg?semt=ais_hybrid&w=740&q=80'
                        onClick={() => setFormData({ ...formData, role: "Admin" })} />
                </div>
                < Button text={<span className='flex items-center justify-center gap-1 '>Next <TbPlayerTrackNextFilled /></span>}
                    bgColor="bg-green-600 w-[300px]"
                    onClick={() => {
                        if (formData.role) setConfirmRole(true)
                        else setError("first choose role!")
                    }} />
                <p className='cursor-pointer hover:underline' onClick={() => navigate("/login")}>Already have an account <span className='text-blue-500'>Login</span></p>
            </motion.div>}

            {confirmRole && <motion.div
                initial={{ scale: 0, opacity: 0, y: 200 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className='w-[370px]  bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-4 '>
                <h1 className='text-3xl'>Register to <span className='text-blue-300'>MyCart</span></h1>
                {error && <p className='text-red-600'>{error}</p>}
                <form className='flex flex-col gap-2' onSubmit={handleSignup}>

                    <div className='h-[355px] overflow-y-auto /* 1. Set the width */
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
                        <input type="text" name='fullName' onChange={handleChange} placeholder='Enter Your Name' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                        <p className='text-lg '>Enter Your Username</p>
                        <input type="text" name='username' onChange={handleChange} placeholder='Enter Your User Name' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                        <p className='text-lg '>Enter Your Email Id</p>
                        <input type="email" name='email' onChange={handleChange} placeholder='Enter Your Email Id' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                        <p className='text-lg '>Enter Your Password</p>
                        <div className='relative'>
                            <input type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} placeholder='Enter Your Password' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                            {!showPassword ? (<FaEye className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(true)} />) : (<FaEyeSlash className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(false)} />)}

                        </div>
                        {formData.role == 'Vendor' &&
                            <div>

                                <p className='text-lg '>Enter Your Shop Name</p>
                                <input type="text" name='shopName' onChange={handleChange} placeholder='Enter Your Shop Name' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />


                                <p className='text-lg '>Enter Your Shop Address</p>
                                <input type="text" name='shopAddress' onChange={handleChange} placeholder='Enter Your Shop Address' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />


                                <p className='text-lg '>Enter Your Gst Number</p>
                                <input type="text" name='gstNumber' onChange={handleChange} placeholder='Enter Your Gst Number' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />

                            </div>}
                    </div>
                    < Button type='submit'
                        text={<span className='flex items-center justify-center gap-1 '>Register <TbPlayerTrackNextFilled className='mt-2' /></span>}
                        bgColor="bg-green-600 w-[300px]" />
                </form>
                <p className='cursor-pointer hover:underline' onClick={() => navigate("/login")}>Already have an account <span className='text-blue-500'>Login</span></p>

            </motion.div>}


        </div>
    )
}

export default Signup
