import React from 'react'

const PendingVendor = () => {
  return (
    <div className='h-screen w-screen pt-20 flex justify-center items-center'>
      <div className='bg-black rounded-4xl shadow-blue-700 shadow-xl hover:shadow-2xl  p-8 text-gray-300 text-center'>
        <h1 className='text-blue-700 text-2xl font-semibold my-2'>Verification Pending ⏳</h1>
        <p className='m-2'>You can access vendor dashboard only after admin verification</p>
        <p className='m-2'>VerificationStatus : <span className='text-blue-700'>PENDING</span></p>
        <p className='text-sm text-gray-500 mt-3'>It usually takes 2-3 hours.</p>
      </div>
    </div>
  )
}

export default PendingVendor
