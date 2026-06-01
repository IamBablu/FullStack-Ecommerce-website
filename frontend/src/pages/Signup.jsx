import React, { useState } from 'react'
import { frameData, motion } from "motion/react"
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import Button from '../components/button';
import Rolebox from '../components/Rolebox';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import logo from '../assets/logo.jpeg'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { userDataContext } from '../context/UserContext';





const Signup = () => {
    const navigate = useNavigate();
    const { userdata, setUserData, serverUrl } = React.useContext(userDataContext)
    // To go for registration page from choose role 
    const [confirmRole, setConfirmRole] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [otpSending, setOtpSending] = useState(false)
    const [sentOtp, setSentOtp] = useState(false)
    const [otpAttempt, setOtpAttempt] = useState(0)


    const [formData, setFormData] = useState({
        username: "",
        otp: "",
        email: "",
        password: "",
        fullName: "",
        role: "",
        shopName: "",
        shopAddress: "",
        gstNumber: "",
    })


    const handleChange = (e) => {
        setError("");
        setLoading(false)
        let { name, value } = e.target;
        if (name == 'email' || name == "username") value = value.toLowerCase();
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSendOtp = async (e) => {
        setOtpSending(true)
        e.preventDefault()
        try {
            await axios.post(`${serverUrl}/users/send-otp`, { email: formData.email }, { withCredentials: true })
            setOtpAttempt(1)
            setSentOtp(true);
            setOtpSending(false)

        } catch (error) {
            setError(error.message);
            console.error(error)
            setOtpSending(false)
        }
    }


    const handleSignup = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const result = await axios.post(`${serverUrl}/users/signup`, formData, { withCredentials: true })
            setUserData(result.data);
            navigate("/")
            setLoading(true)
            window.location.reload();
        } catch (error) {
            setUserData(null)
            console.error(error)
            setError(error.message)
            setLoading(false)
        }
    }


    return (
        <div className='text-white h-screen w-full bg-linear-to-b from-blue-950 to-black flex justify-center items-center relative'>

            <div className='lg:hidden h-26 w-full bg-black absolute top-0 left-0 flex items-center justify-around'>
                <img className='w-24 h-24 rounded-full' src={logo} alt="" />
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
                className='w-100 bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-4'>
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
                className='bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-8 '>
                <h1 className='text-3xl'>Register to <span className='text-blue-300'>MyCart</span></h1>
                {error && <p className='text-red-600'>{error}</p>}
                <form className='flex flex-col gap-2' onSubmit={handleSignup}>

                    <div className='h-100 overflow-y-auto /* 1. Set the width */
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
                        <input required type="text" name='fullName' onChange={handleChange} placeholder='Enter Your Name' className='w-100 rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                        <p className='text-lg '>Enter Your Username</p>
                        <input required type="text" name='username' onChange={handleChange} placeholder='Enter Your User Name' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                        <div className='relative'>
                            <p className='text-lg '>Enter Your Email Id</p>
                            <input required type="email" name='email' onChange={handleChange} placeholder='Enter Your Email Id' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                            < Button
                                text={otpSending ? 'sending' : (otpAttempt > 0 ? "resend" : "send")}
                                bgColor="bg-green-600 w-[100px] absolute top-8 right-0 border-2 border-x-blue-500"
                                onClick={handleSendOtp}
                                disable={loading} />
                        </div>
                        {sentOtp && <div>
                            <p className='text-lg '>Enter Otp</p>
                            <input required type="text" name='otp' onChange={handleChange} placeholder='Enter Your Otp' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                        </div>}
                        <p className='text-lg '>Enter Your Password</p>
                        <div className='relative'>
                            <input required type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} placeholder='Enter Your Password' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />
                            {!showPassword ? (<FaEye className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(true)} />) : (<FaEyeSlash className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(false)} />)}

                        </div>
                        {formData.role == 'Vendor' &&
                            <div>

                                <p className='text-lg '>Enter Your Shop Name</p>
                                <input type="text" name='shopName' onChange={handleChange} placeholder='Enter Your Shop Name' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />


                                <p className='text-lg '>Enter Your Shop Address</p>
                                <input type="text" name='shopAddress' onChange={handleChange} placeholder='Enter Your Shop Address' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />


                                <p className='text-lg '>Enter Your Gst Number</p>
                                <input type="text" name='gstNumber' onChange={handleChange} placeholder='Enter Your Gst Number' className='w-full rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950' />

                            </div>}
                    </div>
                    < Button type='submit'
                        text={loading ? "Registering...." : <span className='flex items-center justify-center gap-1 '>Register <TbPlayerTrackNextFilled className='mt-2' /></span>}
                        bgColor="bg-green-600 w-full"
                        disable={loading} />
                </form>
                <p className='cursor-pointer hover:underline' onClick={() => navigate("/login")}>Already have an account <span className='text-blue-500'>Login</span></p>

            </motion.div>}


        </div>
    )
}

export default Signup
