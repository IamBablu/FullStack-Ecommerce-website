import React, {useState} from 'react'
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
import PendingVendor from '../components/vendor/PendingVendor'
import RejectedVendor from '../components/vendor/RejectedVendor'

const Home = () => {
    const [activePageAdmin, setActivePageAdmin] = useState('dashboard')
  const navigate = useNavigate()
  const {serverUrl, userdata, setUserData} = React.useContext(userDataContext)
  const panel = userdata?.data.role || 'User';
  const renderComponent = () =>{
    switch (panel) {
      case "Admin" : return (<><AdminNavbar activePageAdmin={activePageAdmin} setActivePageAdmin={setActivePageAdmin}/> <AdminDashboard activePageAdmin={activePageAdmin} setActivePageAdmin={setActivePageAdmin}/> <AdminFooter /> </>)
      case "Vendor" : 
        if(userdata?.data.verificationStatus == 'Pending'){
          return (<><VendorNavbar /> <PendingVendor /></>)
        }else if(userdata?.data.verificationStatus == 'Rejected'){
          return (<><VendorNavbar /> <RejectedVendor /></>)
        }else return (<><VendorNavbar /> <VendorDashboard/> <VendorFooter /> </>)
      default : return (<><Navbar /> <Dashboard/> <Footer /> </>)
    } 
  }



  const handleLogOut = async () => {
    try {
    await axios.get(`${serverUrl}/users/signout`,{withCredentials: true})
    setUserData(null)
    navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <AnimatePresence mode='wait'>
      <motion.div className='scroll-hidden text-white h-screen w-full bg-linear-to-b from-blue-950 to-black relative overflow-x-hidden'>
      {renderComponent()}
      </motion.div>
    </AnimatePresence>
  )
}

export default Home
