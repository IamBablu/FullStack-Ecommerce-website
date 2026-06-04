import React, { useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { userDataContext } from '../../context/UserContext'
import Navbar from './Navbar'
import Footer from './Footer'
import { StarRating } from '../../context/UserContext'
import logo from '../../assets/image1.jpg'
import { motion, AnimatePresence } from 'motion/react'

import { BsCartCheckFill, BsHeart, BsHeartFill, BsShare, BsTruck, BsShieldCheck, BsArrowReturnLeft, BsCashCoin } from "react-icons/bs";
import { FaRupeeSign, FaStore, FaTag, FaBox, FaCheckCircle, FaTruck, FaExchangeAlt, FaShieldAlt, FaWallet } from "react-icons/fa";
import { useContext } from 'react'
import ProductSection from './ProductSection'
import { ScrollContext } from '../../context/UserContext'
import axios from 'axios'

const UserProduct = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const product = location.state?.product;
  const { serverUrl, userdata, setUserData, cart, setCart, editToCartGlobal } = useContext(userDataContext)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const pageRef = useRef()

  const scrollToTop = () => {
    pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    await editToCartGlobal(product, 'add', navigate)
    setIsAdding(false)
  }

  const discount = product?.discount || 0
  const originalPrice = product?.price || 0
  const discountedPrice = originalPrice - (originalPrice * discount / 100)
  const rating = product?.reviews?.rating / product?.reviews?.length || 4.5
  const reviewCount = product?.reviews?.length || 1352

  return (
    <div ref={pageRef} className='scroll-hidden text-white h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-y-auto'>
      <Navbar />
      
      <div className='container mx-auto px-4 pt-24 pb-12'>
        {/* Product Main Section */}
        <div className='flex flex-col lg:flex-row gap-8 mb-12'>
          {/* Image Gallery */}
          <div className='lg:w-1/2'>
            <div className='flex flex-col md:flex-row gap-4'>
              {/* Thumbnails */}
              <div className='flex md:flex-col gap-3 order-2 md:order-1'>
                {product?.image?.map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      currentIndex === i ? 'border-blue-500 shadow-lg' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentIndex(i)}
                  >
                    <img 
                      src={item} 
                      alt={`thumb-${i}`} 
                      className='h-16 w-16 md:h-20 md:w-20 object-cover'
                    />
                  </motion.div>
                ))}
              </div>

              {/* Main Image */}
              <div className='flex-1 order-1 md:order-2'>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className='bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 flex items-center justify-center'
                >
                  <img 
                    src={product?.image[currentIndex]} 
                    alt="product-image" 
                    className='h-80 md:h-96 object-contain'
                  />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className='lg:w-1/2 space-y-4'>
            {/* Category Badge */}
            <div className='inline-block'>
              <span className='px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold'>
                {product?.category?.split('-').join(' ')}
              </span>
            </div>

            {/* Title */}
            <h1 className='text-3xl md:text-4xl font-bold text-white'>
              {product?.title}
            </h1>

            {/* Rating */}
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1'>
                <StarRating count={rating} css='text-lg' />
              </div>
              <span className='text-gray-400 text-sm'>
                ({reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className='flex items-baseline gap-3'>
              {discount > 0 ? (
                <>
                  <span className='text-4xl font-bold text-green-500 flex items-center'>
                    <FaRupeeSign className='text-3xl' />
                    {Math.round(discountedPrice).toLocaleString()}
                  </span>
                  <span className='text-xl text-gray-500 line-through'>
                    ₹{originalPrice.toLocaleString()}
                  </span>
                  <span className='px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold'>
                    {discount}% OFF
                  </span>
                </>
              ) : (
                <span className='text-4xl font-bold text-green-500 flex items-center'>
                  <FaRupeeSign className='text-3xl' />
                  {originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className='flex items-center gap-2'>
              <div className={`w-2 h-2 rounded-full ${product?.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`font-semibold ${product?.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <div className='bg-gray-800/50 rounded-xl p-4'>
              <p className='text-gray-300 leading-relaxed'>
                {product?.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {product?.stock > 0 && (
              <div className='flex items-center gap-4'>
                <span className='text-gray-300'>Quantity:</span>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='w-8 h-8 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-xl font-bold'
                  >
                    -
                  </button>
                  <span className='w-12 text-center text-xl font-semibold'>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product?.stock, quantity + 1))}
                    className='w-8 h-8 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-xl font-bold'
                  >
                    +
                  </button>
                  <span className='text-gray-400 text-sm'>{product?.stock} available</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex gap-4 pt-4'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={isAdding || product?.stock === 0}
                className='flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 py-3 rounded-xl font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
              >
                {isAdding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <BsCartCheckFill className='text-xl' />
                    Add to Cart
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-6 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  isWishlisted 
                    ? 'border-red-500 bg-red-500/20 text-red-400' 
                    : 'border-gray-600 hover:border-red-500 text-gray-400 hover:text-red-400'
                }`}
              >
                {isWishlisted ? <BsHeartFill className='text-xl' /> : <BsHeart className='text-xl' />}
                Wishlist
              </motion.button>
            </div>

            {/* Buy Now Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='w-full bg-gradient-to-r from-green-600 to-emerald-600 py-3 rounded-xl font-semibold text-white hover:shadow-lg transition-all'
            >
              Buy Now
            </motion.button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Size Section */}
            <div className='bg-gray-800/30 rounded-xl p-6'>
              <h2 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
                <FaTag className='text-blue-400' />
                Available Sizes
              </h2>
              <div className='flex flex-wrap gap-3'>
                {product?.size?.length > 0 ? (
                  product.size.map((item, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(item)}
                      className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                        selectedSize === item
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {item}
                    </motion.button>
                  ))
                ) : (
                  <span className='px-5 py-2 bg-gray-700 rounded-lg text-gray-300'>Free Size</span>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className='bg-gray-800/30 rounded-xl p-6'>
              <h2 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
                <BsTruck className='text-green-400' />
                Delivery Information
              </h2>
              <div className='space-y-3'>
                {product?.freeDelivery && (
                  <div className='flex items-center gap-3 text-green-400'>
                    <FaCheckCircle />
                    <span>Free Delivery available</span>
                  </div>
                )}
                {product?.deliveryCharge > 0 && (
                  <div className='flex items-center gap-3 text-gray-300'>
                    <FaTruck />
                    <span>Delivery Charge: ₹{product?.deliveryCharge}</span>
                  </div>
                )}
                {product?.replacementDays && (
                  <div className='flex items-center gap-3 text-blue-400'>
                    <FaExchangeAlt />
                    <span>{product?.replacementDays} days replacement policy</span>
                  </div>
                )}
                {product?.warranty && (
                  <div className='flex items-center gap-3 text-purple-400'>
                    <FaShieldAlt />
                    <span>{product?.warranty} warranty</span>
                  </div>
                )}
                {product?.payOnDelivery && (
                  <div className='flex items-center gap-3 text-orange-400'>
                    <FaWallet />
                    <span>Cash on Delivery available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Highlights */}
          <div className='bg-gray-800/30 rounded-xl p-6'>
            <h2 className='text-xl font-semibold text-white mb-4 flex items-center gap-2'>
              <BsShieldCheck className='text-green-400' />
              Product Highlights
            </h2>
            <ul className='space-y-3'>
              {product?.detailPoints?.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className='flex items-start gap-3 text-gray-300'
                >
                  <FaCheckCircle className='text-green-400 mt-0.5 flex-shrink-0' />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-700'></div>
          </div>
          <div className='relative flex justify-center'>
            <span className='px-4 bg-gray-900 text-gray-400 text-sm'>You May Also Like</span>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <ScrollContext.Provider value={scrollToTop}>
            <ProductSection />
          </ScrollContext.Provider>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default UserProduct