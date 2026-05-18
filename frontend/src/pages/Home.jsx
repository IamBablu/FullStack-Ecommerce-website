import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import Navbar from '../components/user/Navbar'
import Dashboard from '../components/user/Dashboard'

const Home = () => {
  const navigate = useNavigate()
  const {serverUrl, userdata, setUserData} = React.useContext(userDataContext)

  const handleLogOut = async () => {
    try {
      console.log("logout clicked....")
    await axios.get('http://127.0.0.1:8000/api/v1/users/signout',{withCredentials: true})
    console.log("logout clicked222....")
    setUserData(null)
    navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <AnimatePresence mode='wait'>
      <motion.div className='scroll-hidden text-white h-[100vh] w-full bg-gradient-to-b from-blue-950 to-black flex justify-center items-center relative overflow-x-hidden'>
      <Navbar onLogout={handleLogOut}/>
      <Dashboard />
      </motion.div>
    </AnimatePresence>
  )
}

export default Home
