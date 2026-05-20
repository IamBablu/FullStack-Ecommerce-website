import React, { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const Footer = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true, amount: 0.2})
  return (
    <footer ref={ref} style={{overflow: 'hidden'}}>
    <motion.div initial={{y: '100%'}}
    animate={isInView? {y: 0}: {y: '100%'}}
    transition={{ duration: .5, ease: 'easeOut'}}
    className='bg-gray-900'>
      <div className=' p-15 px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      <ul>
        <li className='text-4xl font-bold mb-4'>MY CART</li>
        <li><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>Smart, secure & scalable multi-vendor eCommerce platform build for performance and growth.</a></li>
      </ul>
      <ul>
        <li className='text-2xl font-bold mb-4'>Quick Links</li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>Home</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>Categories</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>Shop</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>Orders</a></li>
      </ul>
      <ul>
        <li className='text-2xl font-bold mb-4'>Help & Support</li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>Support</a></li>
        <li className='my-2'><a href="/" className='hover:underline hover:underline-offset-4 hover:decoration-2 hover:decoration-blue-700'>Track-Orders</a></li>
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

export default Footer
