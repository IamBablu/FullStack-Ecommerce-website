import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext'
import Navbar from '../components/user/Navbar'
import Dashboard from '../components/user/Dashboard'
import Footer from '../components/user/Footer'
import AdminNavbar from '../components/admin/AdminNavbar'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminFooter from '../components/admin/AdminFooter'
import VendorNavbar from '../components/vendor/VendorNavbar'
import VendorDashboard from '../components/vendor/VendorDashboard'
import VendorFooter from '../components/vendor/VendorFooter'

const Home = () => {
  const navigate = useNavigate()
  const {serverUrl, userdata, setUserData} = React.useContext(userDataContext)
  const panel = "Admin"
  const renderComponent = () =>{
    switch (panel) {
      case "Admin" : return (<><AdminNavbar /> <AdminDashboard/> <AdminFooter /> </>)
      case "Vendor" : return (<><VendorNavbar /> <VendorDashboard/> <VendorFooter /> </>)
      default : return (<><Navbar /> <Dashboard/> <Footer /> </>)
    } 
  }



  const handleLogOut = async () => {
    try {
    await axios.get('http://127.0.0.1:8000/api/v1/users/signout',{withCredentials: true})
    setUserData(null)
    navigate("/login")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <AnimatePresence mode='wait'>
      <motion.div className='scroll-hidden text-white h-[100vh] w-full bg-gradient-to-b from-blue-950 to-black relative overflow-x-hidden'>
      {renderComponent()}
      </motion.div>
    </AnimatePresence>
  )
}

export default Home
