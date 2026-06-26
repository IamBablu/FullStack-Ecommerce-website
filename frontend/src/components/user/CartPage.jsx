import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Footer from './Footer'
import Loading from '../../pages/Loading'

const CartPage = () => {
  const { serverUrl, cart, setCart, editToCartGlobal, loading, userdata, setActivePage } = useContext(userDataContext)
  const [productCart, setProductCart] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    setActivePage("Home")
    const fetchCartProduct = async () => {
      if (!cart || cart?.length === 0) {
        setProductCart([])
        return;
      }
      try {
        const ids = cart?.map(item => item?.product);
        const result = await axios.get(`${serverUrl}/product/get-cart-product`, { 
          params: { ids: JSON.stringify(ids) }, 
          withCredentials: true 
        });
        
        setProductCart(result?.data?.data || []);
      } catch (error) {
        console.error("Error fetching items details:", error)
      }
    }
    fetchCartProduct();
  }, [JSON.stringify(cart), serverUrl])

  // Calculate total items and price for summary
  const totalItems = cart?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;
  const totalPrice = cart?.reduce((sum, cartItem) => {
    const product = productCart.find(p => p._id === cartItem.product);
    return sum + (product?.price || 0) * (cartItem?.quantity || 0);
  }, 0) || 0;

  return (
    <>
      {loading ? <Loading /> : (
        <div className='h-screen w-full scroll-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-x-hidden'>
          <Navbar />
          
          <div className='max-w-6xl mx-auto px-4 py-6'>
            
            {/* Cart Header with Stats */}
            {productCart?.length > 0 && (
              <div className='mb-6 bg-linear-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-2xl shadow-purple-500/10'>
                <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                  <div className='flex items-center gap-4'>
                    <div className='relative'>
                      <div className='absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-70'></div>
                      <div className='relative bg-linear-to-r from-purple-500 to-pink-500 p-3 rounded-xl shadow-lg'>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h2 className='text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                        Your Cart
                      </h2>
                      <p className='text-sm text-purple-300/70'>{totalItems} items • ₹{totalPrice}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/shop')}
                    className='cursor-pointer group px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-purple-500/30 hover:border-purple-500/60 rounded-full text-purple-300 hover:text-white transition-all duration-300 flex items-center gap-2'
                  >
                    <span>Continue Shopping</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className='space-y-4'>
              {cart?.map((cartItem, i) => {
                const item = productCart.find(p => p._id === cartItem.product);
                if (!item) return null; 

                const currQuantity = cart?.find(c => c.product == item._id)?.quantity || 0;
                if (currQuantity === 0) return null;
                
                return (
                  <div 
                    key={item._id || i} 
                    className='bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden'
                  >
                    <div className='flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-5'>
                      {/* Product Image */}
                      <div 
                        className='relative w-full sm:w-28 h-48 sm:h-28 rounded-xl overflow-hidden cursor-pointer bg-gray-700'
                        onClick={() => { navigate('/user-product', { state: { product: item } }) }}
                      >
                        <img 
                          src={item?.image?.[0]} 
                          alt={item?.title}
                          className='w-full h-full object-cover hover:scale-110 transition-transform duration-500'
                        />
                        {item?.discount && (
                          <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg'>
                            {item?.discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className='flex-1 w-full'>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                          <div className='flex-1'>
                            <h3 
                              className='text-lg font-semibold text-white hover:text-blue-400 cursor-pointer transition-colors'
                              onClick={() => { navigate('/user-product', { state: { product: item } }) }}
                            >
                              {item?.title}
                            </h3>
                            <div className='flex items-center gap-3 mt-1'>
                              <span className='text-2xl font-bold text-green-400'>
                                ₹{item?.price}
                              </span>
                              {item?.originalPrice && (
                                <span className='text-sm text-gray-500 line-through'>
                                  ₹{item?.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls & Actions */}
                          <div className='flex flex-wrap items-center gap-3 mt-2 sm:mt-0'>
                            <div className='flex items-center gap-1 bg-gray-700/50 rounded-full p-1 border border-gray-600'>
                              <button 
                                className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600 transition-all duration-200 text-white font-bold hover:scale-110 active:scale-90'
                                onClick={(e) => { e.stopPropagation(); editToCartGlobal(item, 'subtract', navigate) }}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className='w-8 text-center font-bold text-white text-lg'>{currQuantity}</span>
                              <button 
                                className='cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-600 transition-all duration-200 text-white font-bold hover:scale-110 active:scale-90'
                                onClick={(e) => { e.stopPropagation(); editToCartGlobal(item, 'add', navigate) }}
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>

                            <div className='flex items-center gap-2'>
                              <button 
                                className='cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105 active:scale-95'
                                onClick={() => { navigate('/checkout-page', { state: { product: item, quantity: currQuantity } }) }}
                              >
                                Checkout
                              </button>
                              <button 
                                className='cursor-pointer p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-all duration-200 hover:scale-110 active:scale-90'
                                onClick={()=>editToCartGlobal(item, "remove", navigate)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Item Total - Mobile */}
                        <div className='sm:hidden flex justify-between items-center mt-3 pt-3 border-t border-gray-700'>
                          <span className='text-sm text-gray-400'>Item Total</span>
                          <span className='text-lg font-bold text-white'>₹{currQuantity * (item?.price || 0)}</span>
                        </div>
                      </div>

                      {/* Item Total - Desktop */}
                      <div className='hidden sm:block text-right min-w-24'>
                        <p className='text-sm text-gray-400'>Total</p>
                        <p className='text-xl font-bold text-white'>₹{currQuantity * (item?.price || 0)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {productCart?.length === 0 && (
                <div className='flex flex-col items-center justify-center py-20'>
                  <div className='bg-gray-800/50 rounded-full p-8 border border-gray-700 mb-6'>
                    <svg className="w-20 h-20 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className='text-2xl font-bold text-white mb-2'>Your cart is empty</h3>
                  <p className='text-gray-400 text-center max-w-sm'>Looks like you haven't added any items yet. Start shopping to fill your cart!</p>
                </div>
              )}
            </div>

          </div>
          <Footer />
        </div>
      )}
    </>
  )
}

export default CartPage;