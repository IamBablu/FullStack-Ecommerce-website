import React, { useState } from 'react'
import { motion } from "motion/react"
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import Button from '../components/button';
import Rolebox from '../components/Rolebox';
import { span } from 'motion/react-client';


const App = () => {
    // To go for registration page from choose role 
    const [confirmRole, setConfirmRole] = useState(false)
    const [role , setRole] = useState("")
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: ""
    })
    console.log(role)
    console.log(formData)

    const handleChange = (e) =>{
        let {name, value} = e.target;
        if(name == 'email' || name == "username") value = value.toLowerCase();
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSignup = () => {
        console.log("Signup")
    }


  return (
    <div className='text-white h-[100vh] w-full bg-gradient-to-b from-blue-950 to-black flex justify-center items-center'>
      
      {!confirmRole && <motion.div 
      initial={{scale: 0, opacity: 0, y: 200}}
      animate={{scale: 1, opacity: 1, y: 0}}
      transition={{duration: 0.5, type: "spring"}}
      className='w-[370px] bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-4'>
        <h1 className='text-3xl'>Choose Your <span className='text-blue-300'>Role</span></h1>
        <div className='flex gap-4 '>
          <Rolebox text= 'User' 
          isSelected={role == "User"}
          img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGWm7kgMH1PEsycRwkyqPcPB1b2NITpD8j2g&s'
          onClick={()=> setRole("User")}/>


          <Rolebox text= 'Vendor' 
          isSelected={role == "Vendor"}
          img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkR0f_N-QMbb0JNreYa_vuG5EcprlYRshSOw&s'
          onClick={()=> setRole("Vendor")}/>


          <Rolebox text= 'Admin' 
          isSelected={role == "Admin"}
          img='https://img.freepik.com/free-vector/business-user-cog_78370-7040.jpg?semt=ais_hybrid&w=740&q=80'
          onClick={()=> setRole("Admin")}/>
        </div>
        < Button text={<span className='flex items-center justify-center gap-1 '>Next <TbPlayerTrackNextFilled /></span>}
                 bgColor="bg-green-600"
                 onClick={()=>{
                     if(role) setConfirmRole(true)
                     else alert("first choose role!")
                     }}/>
      </motion.div> }

        {confirmRole && <motion.div 
        initial={{scale: 0, opacity: 0, y: 200}}
        animate={{scale: 1, opacity: 1, y: 0}}
        transition={{duration: 0.5, type: "spring"}}
        className='w-[370px]  bg-black hover:shadow-2xl shadow-xl shadow-blue-600 rounded-2xl flex items-center flex-col gap-4 p-4'>
            <h1 className='text-3xl'>Register to <span className='text-blue-300'>MyCart</span></h1>
            <form className='flex flex-col gap-2' onSubmit={handleSignup}>
                <input type="text" name='username' onChange={handleChange} placeholder='Enter Your User Name' className='w-full h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-lg p-[20px] ' />
                <input type="email" name='email' onChange={handleChange} placeholder='Enter Your Email Id' className='w-full h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-lg p-[20px] ' />
                <input type="text" name='fullName' onChange={handleChange} placeholder='Enter Your Name' className='w-full h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-lg p-[20px] ' />
                <div className='relative'>
                <input type="text" name='password' onChange={handleChange} placeholder='Enter Your Password' className='w-full h-[60px] rounded-full outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-lg p-[20px] ' />
                </div>
            < Button type='submit'
            text={<span className='flex items-center justify-center gap-1 '>Register <TbPlayerTrackNextFilled /></span>}
            bgColor="bg-green-600"/>
            </form>

        </motion.div>}
        
      
    </div>
  )
}

export default App
