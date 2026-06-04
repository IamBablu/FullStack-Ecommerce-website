import React, { useContext, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { userDataContext, useScrollToTop } from '../../context/UserContext'
import { StarRating } from '../../context/UserContext';

import { BsCartCheckFill } from "react-icons/bs";
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForwardOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ pro }) => {
    const [activeDot, setActiveDot] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData, cart, setCart, editToCartGlobal } = useContext(userDataContext)
    const scrollToTop = useScrollToTop();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -10 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => { navigate('/user-product', { state: { product: pro } }); scrollToTop?.() }}
            className='relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 cursor-pointer overflow-hidden group w-64'
        >
            {/* Image Container */}
            <div className='relative bg-gradient-to-br from-gray-100 to-gray-200 p-6 pt-8 overflow-hidden'>
                <motion.img 
                    src={pro?.image[activeDot]} 
                    alt={pro?.title} 
                    className='w-full h-44 object-contain transition-transform duration-500 group-hover:scale-110'
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                />
                
                {/* Navigation Dots */}
                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'>
                    {pro?.image?.map((_, i) => (
                        <motion.div 
                            key={i} 
                            whileHover={{ scale: 1.3 }}
                            className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                                activeDot === i 
                                    ? 'bg-blue-600 w-4' 
                                    : 'bg-gray-400 w-2 hover:bg-gray-600'
                            }`} 
                            onClick={(e) => { e.stopPropagation(); setActiveDot(i) }}
                        />
                    ))}
                </div>

                {/* Navigation Arrows */}
                <motion.button 
                    whileHover={{ scale: 1.1, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white'
                    onClick={(e) => { e.stopPropagation(); setActiveDot(prev => prev === 0 ? pro.image.length - 1 : prev - 1) }}
                >
                    <IoCaretBack className='text-gray-700 text-sm' />
                </motion.button>

                <motion.button 
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white'
                    onClick={(e) => { e.stopPropagation(); setActiveDot(prev => (prev + 1) % pro.image.length) }}
                >
                    <IoCaretForwardOutline className='text-gray-700 text-sm' />
                </motion.button>
            </div>

            {/* Product Info */}
            <div className='p-4 space-y-2'>
                {/* Category Badge */}
                <div className='inline-block'>
                    <span className='text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-medium'>
                        {pro?.category?.split('-').join(' ')}
                    </span>
                </div>

                {/* Title */}
                <h3 className='text-lg font-bold text-gray-800 line-clamp-1'>
                    {pro?.title}
                </h3>

                {/* Rating */}
                <div className='flex items-center gap-2'>
                    <StarRating count={((pro?.reviews?.rating) / (pro?.reviews?.length)) || 4.5} css='text-sm' />
                    <span className='text-xs text-gray-500'>({pro?.reviews?.length || 0})</span>
                </div>

                {/* Price */}
                <div className='flex items-baseline gap-2'>
                    <h1 className='text-2xl font-bold text-green-600'>₹{pro?.price?.toLocaleString()}</h1>
                    {pro?.originalPrice && (
                        <span className='text-sm text-gray-400 line-through'>₹{pro?.originalPrice}</span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg mt-3 ${pro?.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => { e.stopPropagation(); if(pro?.stock !== 0) editToCartGlobal(pro, 'add', navigate) }}
                >
                    <BsCartCheckFill className='text-white text-lg' />
                    <button className='text-white font-semibold text-sm cursor-pointer'>
                        Add to Cart
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ProductCard