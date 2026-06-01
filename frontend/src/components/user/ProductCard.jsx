import React, { useContext, useState } from 'react'
import { motion } from 'motion/react'
import axios from 'axios'
import { userDataContext, useScrollToTop } from '../../context/UserContext'
import { StarRating } from '../../context/UserContext';

import { BsCartCheckFill } from "react-icons/bs";
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForwardOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';


const ProductCard = ({ pro}) => {
    const [activeDot, setActiveDot] = useState(0)
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData, cart, setCart, editToCartGlobal } = useContext(userDataContext)
    const scrollToTop = useScrollToTop();

    return (< motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => {navigate('/user-product', { state: { product: pro } }); scrollToTop?.()}}
        className='bg-white h-88 w-54 rounded-2xl hover:shadow-2xl hover:shadow-blue-500'
    >
        <div className='relative'>
            <img src={pro?.image[activeDot]} alt="images" className='mx-8 object-cover h-40 w-38 my-2 rounded-xl' />
            <div className='absolute top-42 left-20 flex justify-center gap-2'>
                {pro?.image?.map((_, i) => (
                    <div key={i} className={`h-2 w-2 ${activeDot == i ? 'bg-black' : 'bg-gray-700'} rounded-full cursor-pointer`} onClick={(e) => {e.stopPropagation(); setActiveDot(i)}}></div>
                ))}
            </div>
            <div>
                <IoCaretForwardOutline className='absolute top-10 md:top-16 right-0 text-4xl text-white bg-gray-800 rounded-full cursor-pointer hover:scale-110' onClick={(e) => {e.stopPropagation(); setActiveDot((pre) => ((pre + 1) % pro.image.length))}} />
                <IoCaretBack className='absolute top-10 md:top-16 left-0 text-4xl text-white bg-gray-800 rounded-full cursor-pointer hover:scale-110' onClick={(e) => {e.stopPropagation(); setActiveDot((pre) => (pre == 0 ? (pro.image.length - 1) : (pre - 1)))}} />
            </div>
            <p className='text-xl font-semibold text-black mt-4 mx-6'>{pro?.title}</p>
            <p className='text-sm text-gray-800 mt-2 mx-6'>{pro?.category}</p>
            <h1 className='text-2xl text-green-700 font-semibold mx-6'>Rs. {pro?.price}</h1>
            <StarRating css='mx-8' count={((pro?.reviews.rating) / pro?.reviews.length) || 4.3} />
            <div className='bg-red-700 flex gap-1 items-center justify-center w-[60%] mx-[15%] py-2 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer' onClick={(e

            ) => {e.stopPropagation(); editToCartGlobal(pro, 'add', navigate)}}>
                <BsCartCheckFill className='cursor-pointer' />
                <button className='cursor-pointer'> Add to Cart</button>
            </div>
        </div>
    </motion.div>)
}

export default ProductCard
