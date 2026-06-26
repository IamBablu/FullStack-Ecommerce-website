import React, { useContext, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { userDataContext, useScrollToTop } from '../../context/UserContext'
import { StarRating } from '../../context/UserContext';
import { BsCartCheckFill } from "react-icons/bs";
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForwardOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye } from 'react-icons/fa';

const ProductCard = ({ pro, viewMode = 'grid' }) => {
    const [activeDot, setActiveDot] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData, cart, setCart, editToCartGlobal } = useContext(userDataContext)
    const scrollToTop = useScrollToTop();

    const handleWishlist = (e) => {
        e.stopPropagation()
        // Add your wishlist API call here
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price || 0)
    }

    // List view card
    if (viewMode === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -5 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => { navigate('/user-product', { state: { product: pro } }); scrollToTop?.() }}
                className='relative bg-linear-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 cursor-pointer overflow-hidden group shadow-xl hover:shadow-2xl hover:shadow-blue-500/20'
            >
                <div className='flex flex-col sm:flex-row'>
                    {/* Image Container */}
                    <div className='relative sm:w-56 md:w-64 lg:w-72 bg-linear-to-br from-gray-700/50 to-gray-800/50 p-4 overflow-hidden'>
                        <motion.img 
                            src={pro?.image?.[activeDot] || pro?.image?.[0]} 
                            alt={pro?.title} 
                            className='w-full h-48 sm:h-56 object-contain transition-transform duration-500 group-hover:scale-105'
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                        />
                        
                        {/* Navigation Dots */}
                        {pro?.image?.length > 1 && (
                            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
                                {pro?.image?.map((_, i) => (
                                    <motion.div 
                                        key={i} 
                                        whileHover={{ scale: 1.3 }}
                                        className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                                            activeDot === i 
                                                ? 'bg-blue-500 w-4' 
                                                : 'bg-gray-500 w-1.5 hover:bg-gray-300'
                                        }`} 
                                        onClick={(e) => { e.stopPropagation(); setActiveDot(i) }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Navigation Arrows */}
                        {pro?.image?.length > 1 && (
                            <>
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70'
                                    onClick={(e) => { e.stopPropagation(); setActiveDot(prev => prev === 0 ? pro.image.length - 1 : prev - 1) }}
                                >
                                    <IoCaretBack className='text-white text-sm' />
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70'
                                    onClick={(e) => { e.stopPropagation(); setActiveDot(prev => (prev + 1) % pro.image.length) }}
                                >
                                    <IoCaretForwardOutline className='text-white text-sm' />
                                </motion.button>
                            </>
                        )}

                        {/* Badges */}
                        <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
                            {pro?.stock === 0 && (
                                <span className='bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                                    Out of Stock
                                </span>
                            )}
                            {pro?.isNew && (
                                <span className='bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                                    NEW
                                </span>
                            )}
                            {pro?.discount > 0 && (
                                <span className='bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg'>
                                    -{pro.discount}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className='flex-1 p-4 md:p-6 flex flex-col justify-between'>
                        <div>
                            {/* Category Badge */}
                            <div className='flex items-center gap-2 mb-2'>
                                <span className='text-xs text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full font-medium border border-blue-500/30'>
                                    {pro?.category?.split('-').join(' ') || 'Uncategorized'}
                                </span>
                                {pro?.stock > 0 && (
                                    <span className='text-xs text-green-400 bg-green-500/20 px-3 py-1 rounded-full font-medium border border-green-500/30'>
                                        In Stock
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h3 className='text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300'>
                                {pro?.title || 'Product Name'}
                            </h3>

                            {/* Description */}
                            <p className='text-gray-400 text-sm mb-3 line-clamp-2'>
                                {pro?.description || 'No description available'}
                            </p>

                            {/* Rating */}
                            <div className='flex items-center gap-3 mb-3'>
                                <div className='flex items-center gap-1'>
                                    <StarRating count={((pro?.reviews?.rating) / (pro?.reviews?.length)) || 4.5} css='text-sm' />
                                    <span className='text-xs text-gray-400 ml-1'>({pro?.reviews?.length || 0})</span>
                                </div>
                                {pro?.soldCount > 0 && (
                                    <span className='text-xs text-gray-400'>
                                        {pro.soldCount} sold
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Price and Actions */}
                        <div className='flex flex-wrap items-center justify-between gap-3 mt-2'>
                            <div>
                                <h1 className='text-2xl font-bold text-green-400'>
                                    {formatPrice(pro?.price)}
                                </h1>
                                {pro?.originalPrice && pro.originalPrice > pro.price && (
                                    <span className='text-sm text-gray-500 line-through ml-2'>
                                        {formatPrice(pro?.originalPrice)}
                                    </span>
                                )}
                            </div>
                            <div className='flex gap-2'>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className='px-4 py-2 bg-gray-700/50 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 flex items-center gap-2 text-sm'
                                    onClick={(e) => { e.stopPropagation(); navigate('/user-product', { state: { product: pro } }); scrollToTop?.() }}
                                >
                                    <FaEye />
                                    <span className='hidden sm:inline'>View</span>
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 text-sm ${pro?.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); if(pro?.stock !== 0) editToCartGlobal(pro, 'add', navigate) }}
                                >
                                    <BsCartCheckFill />
                                    <span>Add to Cart</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    // Grid view card (original enhanced)
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => { navigate('/user-product', { state: { product: pro } }); scrollToTop?.() }}
            className='relative bg-linear-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-500 cursor-pointer overflow-hidden group shadow-xl hover:shadow-2xl hover:shadow-blue-500/20'
        >
            {/* Image Container */}
            <div className='relative bg-linear-to-br from-gray-700/50 to-gray-800/50 p-4 pt-6 overflow-hidden'>
                <motion.img 
                    src={pro?.image?.[activeDot] || pro?.image?.[0]} 
                    alt={pro?.title} 
                    className='w-full h-44 md:h-52 object-cover transition-transform duration-500 group-hover:scale-110'
                    animate={{ scale: isHovered ? 1.05 : 1 }}
                />
                
                {/* Navigation Dots */}
                {pro?.image?.length > 1 && (
                    <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5'>
                        {pro?.image?.map((_, i) => (
                            <motion.div 
                                key={i} 
                                whileHover={{ scale: 1.3 }}
                                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                                    activeDot === i 
                                        ? 'bg-blue-500 w-4' 
                                        : 'bg-gray-500 w-1.5 hover:bg-gray-300'
                                }`} 
                                onClick={(e) => { e.stopPropagation(); setActiveDot(i) }}
                            />
                        ))}
                    </div>
                )}

                {/* Navigation Arrows */}
                {pro?.image?.length > 1 && (
                    <>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70'
                            onClick={(e) => { e.stopPropagation(); setActiveDot(prev => prev === 0 ? pro.image.length - 1 : prev - 1) }}
                        >
                            <IoCaretBack className='text-white text-sm' />
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70'
                            onClick={(e) => { e.stopPropagation(); setActiveDot(prev => (prev + 1) % pro.image.length) }}
                        >
                            <IoCaretForwardOutline className='text-white text-sm' />
                        </motion.button>
                    </>
                )}
            </div>

            {/* Product Info */}
            <div className='p-4 space-y-2.5'>
                {/* Category Badge */}
                <div className='inline-block'>
                    <span className='text-xs text-blue-400 bg-blue-500/20 px-2.5 py-1 rounded-full font-medium border border-blue-500/30'>
                        {pro?.category?.split('-').join(' ') || 'Uncategorized'}
                    </span>
                </div>

                {/* Title */}
                <h3 className='text-base font-bold text-white line-clamp-2 min-h-14 group-hover:text-blue-400 transition-colors duration-300'>
                    {pro?.title || 'Product Name'} 
                </h3>

                {/* Rating */}
                <div className='flex items-center gap-2'>
                    <div className='flex items-center'>
                        <StarRating count={((pro?.reviews?.rating) / (pro?.reviews?.length)) || 4.5} css='text-xs' />
                    </div>
                    <span className='text-xs text-gray-400'>({pro?.reviews?.length || 0})</span>
                    {pro?.soldCount > 0 && (
                        <span className='text-xs text-gray-500'>• {pro.soldCount} sold</span>
                    )}
                </div>

                {/* Price */}
                <div className='flex items-baseline gap-2'>
                    <h1 className='text-xl font-bold text-green-400'>
                        {formatPrice(pro?.price)}
                    </h1>
                    {pro?.originalPrice && pro.originalPrice > pro.price && (
                        <span className='text-sm text-gray-500 line-through'>
                            {formatPrice(pro?.originalPrice)}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                {pro?.stock > 0 && (
                    <p className='text-xs text-orange-400'>
                        Only {pro.stock} left!
                    </p>
                )}

                {/* Add to Cart Button */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`bg-linear-to-r from-blue-600 to-indigo-600 flex items-center justify-center gap-2 py-2.5 rounded-xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg mt-1 ${pro?.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => { e.stopPropagation(); if(pro?.stock !== 0) editToCartGlobal(pro, 'add', navigate) }}
                >
                    <BsCartCheckFill className='text-white text-base' />
                    <button className='text-white font-semibold text-xs sm:text-sm cursor-pointer'>
                        {pro?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default ProductCard