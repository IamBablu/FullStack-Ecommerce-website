import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const VendorFooter = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true, amount: 0.2})
  return (
    <footer ref={ref} style={{overflow: 'hidden'}}>
    <motion.div initial={{y: '100%'}}
    animate={isInView? {y: 0}: {y: '100%'}}
    transition={{ duration: .5, ease: 'easeOut'}}
    className='bg-gray-800'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 p-15 px-20'>
      <ul>
        <li className='text-4xl font-bold mb-4'>MY CART</li>
        <li><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>Smart, secure & scalable multi-vendor eCommerce platform build for performance and growth.</a></li>
        <button className='p-2 rounded-full text-xl bg-blue-700 px-4 my-6 hover:bg-blue-900 shadow-lg hover:shadow-gray-500 cursor-pointer transition-all duration-300 border-white border-2'>Vendor Panel</button>
      </ul>
      <ul className='border-2 border-gray-500 rounded-2xl p-4 bg-gray-600/30 hover:shadow-blue-600 shadow-xl'>
        <li className='text-2xl font-semibold'>Vendor DashBoard</li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>&#x2714; Product Upload & Edit</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>&#x2714; Order & Delivery Tracking</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>&#x2714; Sales & Profit Analytics</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>&#x2714; Wallet & Settlement</a></li>
      </ul>
      <ul>
        <li className='text-2xl font-bold mb-4'>Contact info</li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>admin@gmail.com</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>+91 7781901503</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>DAV. IET Medininagar, Palamu, Jharkhand. </a></li>
      </ul>
      </div>
      <h1 className='h-0.5 w-full bg-gray-500'></h1>
      <p className='text-center py-4 select-none text-gray-400 font-semibold'>&copy; 2026 MyCart - Powered by WebMind AI.</p>
    
    </motion.div>
    </footer>
  )
}

export default VendorFooter
