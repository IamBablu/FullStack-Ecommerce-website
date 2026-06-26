import React, { useState } from 'react'
import { userDataContext } from '../../context/UserContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
const serviceCharge = 50;

const CheckOutPage = () => {
  const { serverUrl, cart, setCart, setActivePage } = useContext(userDataContext)
  const [paymentType, setPaymentType] = useState('cod');
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate()

  const product = location?.state?.product;
  const quantity = location?.state?.quantity;

  const totalPrice = (product?.price * quantity) + (product?.deliveryCharge || 0) + serviceCharge;

  const [formData, setFormData] = useState({
    userInfo: {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      pinCode: '',
    },
    productId: product?._id || '',
    quantity: quantity || 1,
    vendorId: product?.vendor || '',
    deliveryCharge: product?.deliveryCharge || 0,
    serviceCharge: serviceCharge,
    price: product?.price || 0,
    totalAmount: totalPrice,
  });

  // Update formData when product/quantity changes
  useEffect(() => {
    setActivePage("Orders")
    if (product && quantity) {
      const newTotalPrice = (product.price * quantity) + (product.deliveryCharge || 0) + serviceCharge;
      setFormData(prev => ({
        ...prev,
        productId: product._id,
        quantity: quantity,
        vendorId: product.vendor,
        deliveryCharge: product.deliveryCharge || 0,
        price: product.price,
        totalAmount: newTotalPrice
      }));
    }
  }, [product, quantity]);

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setFormData({
      ...formData,
      userInfo: {
        ...formData.userInfo,
        [name]: value
      }
    });
  }

  const handleSubmit = async () => {
    setError("")
    console.log(formData.userInfo)
    const { name, email, phone, city, pinCode, address } = formData.userInfo;
    if (!name || !email || !phone || !city || !pinCode || !address) {
      setError("All fields are required");
      console.log("All fields are required")
      return;
    }
    try {
      const paymentMethod = paymentType.toLowerCase() || "cod";
      const orderData = {
        ...formData,
        paymentMethod
      }
      if (paymentMethod == "cod") {
        const result = await axios.post(`${serverUrl}/order/place-order`, orderData, { withCredentials: true })
        console.log(result?.data?.data)
        setCart(pre => pre.filter(item => item._id.toString() !== orderData.productId.toString()))
        navigate("/orders")
      } else if (paymentMethod == "stripe") {
        console.log("not allowed")
        return;
      }
    } catch (error) {
      console.error(error)
      setError(error)
    }
  }

  return (
    <div className='h-screen w-full overflow-x-hidden scroll-hidden bg-linear-to-br from-[#0a0e27] via-[#1a1040] to-[#0a0e27] relative'>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <Navbar />
      
      <div className='relative z-10 min-h-screen pb-32 flex justify-center items-start sm:items-center px-4 py-8'>
        <div className='w-full max-w-6xl'>
          {/* Error Message */}
          {error && (
            <div className='mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center'>
              {error}
            </div>
          )}
          
          <div className='flex flex-col lg:flex-row gap-6 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl'>
            
            {/* Left Column - Delivery Address */}
            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-white mb-4 flex items-center gap-2'>
                <span className='bg-linear-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg'>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Delivery Address
              </h1>
              
              <form className='space-y-3'>
                <input 
                  required 
                  type="text" 
                  name="name" 
                  placeholder='Full Name' 
                  onChange={handleChange} 
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all' 
                />
                <input 
                  required 
                  type="number" 
                  name="phone" 
                  placeholder='Phone Number' 
                  onChange={handleChange} 
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
                />
                <input 
                  required 
                  type="email" 
                  name="email" 
                  placeholder='Email Id' 
                  onChange={handleChange} 
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all' 
                />
                <input 
                  required 
                  type="text" 
                  name="address" 
                  placeholder='Complete Address' 
                  onChange={handleChange} 
                  className='w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all' 
                />
                <div className='flex flex-col md:flex-row gap-3'>
                  <input 
                    required 
                    type="text" 
                    name="city" 
                    placeholder='City' 
                    onChange={handleChange} 
                    className='flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all' 
                  />
                  <input 
                    required 
                    type="number" 
                    name="pinCode" 
                    placeholder='PinCode' 
                    onChange={handleChange} 
                    className='flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' 
                  />
                </div>
              </form>
            </div>

            {/* Right Column - Order Summary */}
            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-white mb-4 flex items-center gap-2'>
                <span className='bg-linear-to-r from-purple-500 to-pink-500 p-1.5 rounded-lg'>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </span>
                Order Summary
              </h1>
              
              {/* Product Card */}
              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col sm:flex-row items-center gap-3'>
                <img 
                  src={product?.image?.[0]} 
                  alt="product" 
                  className='h-20 w-20 rounded-lg object-cover' 
                />
                <div className='flex-1 text-center sm:text-left'>
                  <p className='text-white font-semibold line-clamp-1'>{product?.title}</p>
                  <p className='text-gray-400 text-sm'>Qty: {quantity}</p>
                </div>
                <p className='text-green-400 font-bold'>₹{product?.price}</p>
              </div>

              {/* Price Breakdown */}
              <div className='space-y-1 text-white'>
                <div className='flex justify-between items-center py-2 border-b border-white/10'>
                  <span className='text-gray-400'>Price</span>
                  <span>{quantity} X ₹{product?.price}</span>
                  <span className='font-medium'>₹{quantity * product?.price}</span>
                </div>
                <div className='flex justify-between items-center py-2 border-b border-white/10'>
                  <span className='text-gray-400'>Delivery Charge</span>
                  <span className='text-green-400'>₹{product?.payOnDelivery ? "0" : product?.deliveryCharge || 0}</span>
                </div>
                <div className='flex justify-between items-center py-1 border-b border-white/10'>
                  <span className='text-gray-400'>Service Charge</span>
                  <span className='font-medium'>₹{serviceCharge}</span>
                </div>
                
                <div className='h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent my-0'></div>
                
                <div className='flex justify-between items-center py-2'>
                  <span className='text-xl font-bold text-white'>Total</span>
                  <span className='text-2xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent'>
                    ₹{totalPrice}
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className='text-lg font-semibold text-white mb-3'>Payment Method</h2>
                <div className='flex flex-col sm:flex-row gap-3 mb-4'>
                  <button 
                    className={`cursor-pointer flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                      paymentType == 'cod' 
                        ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`} 
                    onClick={() => setPaymentType("cod")}
                  >
                    Cash On Delivery
                  </button>
                  <button 
                    className={`cursor-pointer flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                      paymentType == 'stripe' 
                        ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`} 
                    onClick={() => alert("Stripe method is not available!")}
                  >
                    Stripe
                  </button>
                </div>

                {/* Confirm Button */}
                <button 
                  onClick={handleSubmit} 
                  className='cursor-pointer w-full py-3.5 bg-linear-to-r from-purple-500 via-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]'
                >
                  {paymentType == "cod" ? "Confirm Order" : "Proceed to Secure Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default CheckOutPage