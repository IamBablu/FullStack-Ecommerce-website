import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { userDataContext } from '../../context/UserContext'
import { StarRating } from '../../context/UserContext'
import axios from 'axios'
import logo from '../../assets/logo.jpeg'
import { useNavigate } from 'react-router-dom'

import { IoCaretBack } from "react-icons/io5";
import { BsCartCheckFill } from "react-icons/bs";
import { IoCaretForwardOutline } from "react-icons/io5";





const ProductSection = () => {
    const { serverUrl, products, setProducts, userdata, setUserData } = useContext(userDataContext)


    const getUserProducts = async () => {
        try {
        const result = await axios.get(`${serverUrl}/product/get-user-product`)
        console.log(result.data.data)
        setProducts(result.data.data)
        } catch (error) {
            console.error(error)
        }
    }

  


    useEffect(() => {
        getUserProducts();
    }, [])
    return (
        <div className=' h-screen w-screen overflow-y-scroll [&::-webkit-scrollbar]:w-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-10 gap-5'>
            {
                products?.map((pro, index) => {
                  return  <ProductCard key={index} pro={pro} />
                })
            }
        </div>
    )
}


const ProductCard = ({ pro }) => {
    const [activeDot, setActiveDot] = useState(0)
    const navigate = useNavigate()
    const { serverUrl, userdata, setUserData, cart, setCart } = useContext(userDataContext)


      const handleAddToCart = async(e) => {
        e.stopPropagation()
        if(!userdata){
            navigate('/login');
            return;
        }
        try {
            console.log("this is cart: ",cart)
            const result = await axios.patch(`${serverUrl}/users/add-to-cart`, {productId: pro._id}, {withCredentials: true})
            const newProduct = result.data.data
            if(cart.length == 0){
                setCart(newProduct)
            } else setCart(pre => {
                const existing = pre?.find(item => item.product === newProduct._id)
                if(existing){
                    return pre?.map(item => item.product === newProduct._id? newProduct : item)
                }

                return [...pre, newProduct]
            })

        } catch (error) {
            console.error(error)
        }
    }

    return (< motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{ scale: 1.03 }}
        onClick={()=> navigate('/user-product', { state: { product: pro }}) }
        className='bg-white h-88 w-54 rounded-2xl hover:shadow-2xl hover:shadow-blue-500'
    >
        <div className='relative'>
            <img src={pro?.image[activeDot]} alt="images" className='mx-8 object-cover h-40 w-38 my-2 rounded-xl' />
            <div className='absolute top-42 left-20 flex justify-center gap-2'>
                {pro?.image?.map((_, i) => (
                    <div key={i} className={`h-2 w-2 ${activeDot == i ? 'bg-black' : 'bg-gray-700'} rounded-full cursor-pointer`} onClick={() =>setActiveDot(i) }></div>
                ))}
            </div>
            <div>
            <IoCaretForwardOutline className='absolute top-10 md:top-16 right-0 text-4xl text-white bg-gray-800 rounded-full cursor-pointer hover:scale-110' onClick={()=> setActiveDot((pre) => ((pre + 1) % pro.image.length))}/>
            <IoCaretBack className='absolute top-10 md:top-16 left-0 text-4xl text-white bg-gray-800 rounded-full cursor-pointer hover:scale-110' onClick={()=> setActiveDot((pre) =>(pre == 0? (pro.image.length - 1) : (pre - 1)))}/>
            </div>
            <p className='text-xl font-semibold text-black mt-4 mx-6'>{pro?.title}</p>
            <p className='text-sm text-gray-800 mt-2 mx-6'>{pro?.category}</p>
            <h1 className='text-2xl text-green-700 font-semibold mx-6'>Rs. {pro?.price}</h1>
                <StarRating count={((pro?.reviews.rating)/pro?.reviews.length) || 4.3}/>
            <div className='bg-red-700 flex gap-1 items-center justify-center w-[60%] mx-[15%] py-2 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer' onClick={handleAddToCart}> 
                <BsCartCheckFill  className='cursor-pointer'/>
               <button className='cursor-pointer'> Add to Cart</button>
            </div>
        </div>
    </motion.div>)
}



export default ProductSection
