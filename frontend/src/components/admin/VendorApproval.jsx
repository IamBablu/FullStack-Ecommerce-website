import React, { useEffect, useState } from 'react'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'

const VendorApproval = () => {
  const { serverUrl, vendors, setVendors } = React.useContext(userDataContext)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [status, setStatus] = useState('Pending')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingVendors, setPendingVendors] = useState(() => vendors?.filter(items => items.verificationStatus == "Pending"))




  const handleVerify = async (newStatus) => {
    try {
      setLoading(true)
      const result = await axios.patch(`${serverUrl}/admin/verify-vendor`, { status: newStatus, vendorId: selectedVendor._id, rejectedReason: reason }, { withCredentials: true })
      setPendingVendors(pre => pre?.filter(item => item._id !== selectedVendor._id))
      setLoading(false)
      setStatus("Pending")
      setSelectedVendor(null)
    } catch (error) {
      console(error)
      setLoading(false)
      setSelectedVendor(null)
    }
  }
  return (
    <div className='bg-black/70 h-full px-8 relative'>
      <h1 className='text-4xl text-center py-2'>Vendor Details</h1>
      <table className='w-full bg-gray-600 mt-3 pb-3 rounded-4xl text-center table-fixed [&_td]:w-1/4'>
        <thead className='text-lg h-16'>
          <tr>
            <th>NAME</th>
            <th>SHOP NAME</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody className='text-sm font-semibold'>
          {pendingVendors?.map((vendor, index) => {
            return <tr key={index} className='h-16 border-t-2'>
              <td className='wrap-break-word pl-4'>{vendor.fullName}</td>
              <td className='wrap-break-word'>{vendor.shopName}</td>
              <td className='wrap-break-word'><span className='bg-yellow-500 p-2 px-4 rounded-full'>{vendor.verificationStatus}</span></td>
              <td className='wrap-break-word pr-4'><span className='bg-green-700 p-2 md:px-4 rounded-full hover:bg-green-900 transition-all duration-300 cursor-pointer' onClick={() => setSelectedVendor(vendor)}> <span className='hidden md:inline'>Check </span>Details</span></td>
            </tr>
          })}
        </tbody>
      </table>
      {selectedVendor && <div className='bg-gray-700/70 absolute top-0 left-0 z-10 h-full w-full flex justify-center items-center'>
        <div className='bg-black p-8 text-white rounded-3xl'>
          <h1 className='text-2xl font-semibold mb-4'>Selected Vendor Details</h1>
          <p className='text-lg font-semibold'>Name:- <samp>{selectedVendor?.fullName}</samp></p>
          <p className='text-lg font-semibold'>Email:- <samp>{selectedVendor?.email}</samp></p>
          <p className='text-lg font-semibold'>Phone:- <samp>{selectedVendor?.phone}</samp></p>
          <p className='text-lg font-semibold'>Shop Name:- <samp>{selectedVendor?.shopName}</samp></p>
          <p className='text-lg font-semibold'>Shop Address:- <samp>{selectedVendor?.shopAddress}</samp></p>
          <p className='text-lg font-semibold'>GST Number:- <samp>{selectedVendor?.gstNumber}</samp></p>
          <div>
            <button className='text-lg font-semibold bg-green-700 py-2 w-32 rounded-2xl mr-4 mt-4 hover:bg-green-900 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90'
              onClick={() => {
                const newStatus = 'Approved'
                setStatus(newStatus)
                handleVerify(newStatus)
              }}>Approve</button>
            <button className='text-lg font-semibold bg-red-700 py-2 w-32 rounded-2xl mr-4 hover:bg-red-900 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90' onClick={() => setStatus("Rejected")}>Reject</button>
            <button className='text-lg font-semibold bg-gray-700 py-2 w-32 rounded-2xl hover:bg-gray-900 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90' onClick={() => setSelectedVendor(null)}>Cancel</button>

          </div>
          {status == "Rejected" && <div className='flex flex-col items-center gap-3 mt-4'>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} maxLength={100} rows={3} placeholder='Enter Rejection Reason' className='w-[80%] rounded-2xl outline-none border-2 border-x-blue-500 bg-transparent text-white placeholder-gray-400 text-xl p-2 hover:border-blue-950'></textarea>
            <p className="text-right text-xs text-gray-500 mt-1">
              {reason.length}/100
            </p>
            <button className='text-lg font-semibold bg-red-600 py-2 w-[300px] rounded-full hover:bg-red-900 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90' onClick={() => {
              const newStatus = status;
              handleVerify(newStatus);
            }}> Confirm Reject</button>
          </div>}
        </div>
      </div>}
    </div>
  )
}

export default VendorApproval
