import React from 'react'
import { userDataContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

const RejectedVendor = () => {
    const {userdata} = React.useContext(userDataContext)
    const navigate = useNavigate()
  return (
    <div className='h-screen w-screen pt-20 flex justify-center items-center'>
      <div className='bg-black rounded-4xl shadow-blue-700 shadow-xl hover:shadow-2xl  p-8 text-gray-300 text-center'>
        <h1 className='text-red-700 text-2xl font-semibold my-2'>Verification Rejected ⏳</h1>
        <p className='m-2'>Your business verification was rejected by Admin</p>
        <p className='m-2'>VerificationStatus : <span className='text-red-700'>REJECTED</span></p>
        <p className='text-sm text-gray-500 mt-3'>Reasion: <span className='text-red-500 font-semibold'>{userdata.data.rejectedReason}</span></p>
        <button className='bg-blue-700 hover:scale-110 active:scale-90 p-2 px-6 rounded-full mt-4 transition-all duration-300 cursor-pointer' onClick={()=>navigate('/update-vendor-details')}>Verify Again</button>
      </div>
    </div>
  )
}

export default RejectedVendor
