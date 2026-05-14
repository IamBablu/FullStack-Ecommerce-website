import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/button'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import logo from '../assets/logo.jpeg'
import { motion } from "motion/react"
import axios from 'axios';



const Login = () => {
    const [error , setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        loginKey: "",
        password: ""
    })

    const navigate = useNavigate();
    const handleChange = (e) =>{
        setError("")
        let {name, value} = e.target;
        if (name == 'loginKey') value = value.toLowerCase();
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleLogin = async(e) =>{
        e.preventDefault();
        try {
            const user = await axios.post('http://127.0.0.1:8000/api/v1/users/signin',formData,{withCredentials: true})
            console.log(user.data)
        } catch (error) {
            console.log(error)
            
        }

        console.log("Login...")
        // navigate("/signup")
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
                    <Button text= 'Signup' bgColor='bg-red-500 text-xl font-semibold w-[90px]' onClick={()=> navigate("/signup")}/>
                </div>
            </div>
      <motion.div
                initial={{ scale: 0, opacity: 0, y: 200 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                className='w-[370px]  bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-4'>
                <h1 className='text-3xl'>Login to <span className='text-blue-300'>MyCart</span></h1>
                {error && <p className='text-red-600'>{error}</p>}
                <form className='flex flex-col gap-2' onSubmit={handleLogin}>
                 
                    <p className='text-lg '>Enter Your Username or Email Id</p>
                    <input type="text" name='loginKey' onChange={handleChange} placeholder='Enter Your User Name or Email Id' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                    <p className='text-lg '>Enter Your Password</p>
                    <div className='relative'>
                        <input type={showPassword ? 'text' : 'password'} name='password' onChange={handleChange} placeholder='Enter Your Password' className='w-[300px] h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-[20px] hover:border-4 hover:border-blue-950' />
                        {!showPassword ? (<FaEye className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(true)} />) : (<FaEyeSlash className='text-xl absolute top-5 right-5 cursor-pointer' onClick={() => setShowPassword(false)} />)}

                    </div>
                    < Button type='submit'
                        text={<span className='flex items-center justify-center gap-1 '>Login <TbPlayerTrackNextFilled className='mt-2'/></span>}
                        bgColor="bg-green-600 w-[300px]" />
                </form>

            </motion.div>
    </div>
    
  )
}

export default Login
