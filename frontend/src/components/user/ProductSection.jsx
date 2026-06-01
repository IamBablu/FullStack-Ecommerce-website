import React, { useContext, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { userDataContext } from '../../context/UserContext'
import { StarRating } from '../../context/UserContext'
import ProductCard from './ProductCard'
import axios from 'axios'
import logo from '../../assets/logo.jpeg'
import { useNavigate } from 'react-router-dom'






const ProductSection = () => {
    const { serverUrl, products, setProducts, userdata, setUserData } = useContext(userDataContext)


    const getUserProducts = async () => {
        try {
        const result = await axios.get(`${serverUrl}/product/get-user-product`)
        setProducts(result.data.data)
        
        
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(() => {
        getUserProducts();
    }, [])
    return (
        <div className=' max:h-screen w-screen overflow-y-scroll [&::-webkit-scrollbar]:w-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 p-10 gap-5'>
            {
                products?.map((pro, index) => {
                  return  <ProductCard key={index} pro={pro}/>
                })
            }
        </div>
    )
}



export default ProductSection
