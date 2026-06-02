import React, { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userDataContext } from '../../context/UserContext'
import Navbar from './Navbar'
import Footer from './Footer'
import { StarRating } from '../../context/UserContext'
import logo from '../../assets/image1.jpg'

import { BsCartCheckFill } from "react-icons/bs";
import { useContext } from 'react'
import ProductSection from './ProductSection'
import {ScrollContext} from '../../context/UserContext'
import axios from 'axios'

const UserProduct = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product;
  const { serverUrl, userdata, setUserData, cart, setCart, editToCartGlobal } = useContext(userDataContext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const pageRef = useRef()


  const scrollToTop = () => {
   pageRef.current?.scrollTo({top: 0, behavior: 'smooth'})
  }

  return (
    <div ref={pageRef} className='scroll-hidden text-white h-screen w-full bg-linear-to-b from-blue-950 to-black relative overflow-x-hidden'>
      <Navbar />
      <div className='w-full'>
        <div className='flex gap-2 px-40 py-10'>
          <div className='h-68 w-64 bg-white flex items-center justify-center rounded-xl'>
            <img src={product?.image[currentIndex]} alt="product-image" className='h-58 w-58 object-cover' />
          </div>
          <div className='flex flex-col gap-2'>
            {
              product?.image.map((item, i) => (
                <img key={i} src={item} alt="sm-image" className='h-15 w-15 object-cover cursor-pointer hover:scale-110 active:scale-90 transition' onClick={()=>setCurrentIndex(i)}/>
              ))
            }
          </div>
          <div className='ml-8 max-w-180'>
            <h1 className='text-2xl'>{product?.title}</h1>
            <p className='text-gray-400 text-lg'>{product?.category}</p>
            <h1 className='text-3xl text-green-600 font-semibold'>Rs. {product?.price}</h1>
            <div className='flex gap-1'>
              {/* <StarRating count={((pro?.reviews.rating) / pro?.reviews.length) || 4.3} /> */}
              <StarRating count={4.3} /> <span className='text-gray-400'>/ 1352 Reviews</span>
            </div>
            <p className='text-gray-400 h-20 overflow-y-scroll [&::-webkit-scrollbar]:w-0 w-180 flex items-center'><span>{product?.description}</span></p>
            <p>Stock: <span className={`${product?.isStockAvailable? "text-green-700" : "text-red-700"} font-semibold`}>{product?.isStockAvailable? "In Stock" : "Out of Stock"}</span></p>
            <div className='bg-blue-700 flex gap-1 items-center justify-center w-[80%] my-2 py-2 rounded-lg hover:scale-110 active:scale-90 transition cursor-pointer' onClick={(e) => {e.stopPropagation(); editToCartGlobal(product, 'add', navigate)}}>
              <BsCartCheckFill className='cursor-pointer' />
              <button className='cursor-pointer'> Add to Cart</button>
            </div>
          </div>
        </div>
        <div className='px-40 flex gap-40'>
          <div>
            <h1 className='text-lg font-semibold mb-4'>Available Size</h1>
          <div>
            {product.size?.length > 0? (product.size?.map((item, i) => (
              <span key={i} className='bg-gray-300 mr-4 p-3 text-black rounded-lg'>{item}</span>
            ))) : (<span className='bg-gray-300 mr-4 p-3 text-black rounded-lg'>Free Size</span>)}
          </div>
          <div className='mt-4'>
            {product?.replacementDays && <p> &#9989; {product?.replacementDays} days Replacement </p>}
            {product?.deliveryCharge > 0  && <p> &#9989; {product?.deliveryCharge} Delivery Charge </p>}
            {product?.freeDelivery && <p> &#9989; Free Delivery </p>}
            {product?.warranty && <p> &#9989;{product?.warranty} Warranty </p>}
            {product?.payOnDelivery && <p> &#9989; Cash on Delivery </p>}

          </div>
          </div>
          <div className='mt-5'>
            <h1 className='text-xl'>Highlights</h1>
            <ul className='list-disc'>
              {product?.detailPoints.map((item, i)=> (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <h1 className='h-1 bg-white my-3'></h1>
        <div >
          <ScrollContext.Provider value={scrollToTop}>
          <ProductSection/>
          </ScrollContext.Provider>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default UserProduct
