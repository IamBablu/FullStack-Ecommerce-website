import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Footer from './Footer'
import Loading from '../../pages/Loading'

const CartPage = () => {
  const { serverUrl, cart, setCart, editToCartGlobal, loading } = useContext(userDataContext)
  const [productCart, setProductCart] = useState([])
  const navigate = useNavigate();





  useEffect(() => {
    const fetchCartProduct = async () => {
      if (!cart || cart.length === 0) {
        setProductCart([])
        return;
      }
      try {
        const ids = cart.map(item => item.product);
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
  

  return (
    <>
      {loading ? <Loading /> : (
        <div className='scroll-hidden text-white h-screen w-full bg-linear-to-b from-blue-950 to-black relative overflow-x-hidden'>
          <Navbar />
          <div className='flex flex-col gap-5 items-center py-2 h-screen overflow-y-scroll [&::-webkit-scrollbar]:w-0 w-full'>
            {cart?.map((cartItem, i) => {
              const item = productCart.find(p => p._id === cartItem.product);
              if (!item) return null; // Skip if product details not found (safety check)

              const currQuantity = cart?.find(c => c.product == item._id)?.quantity || 0;
              if (currQuantity === 0) return null; // Safe rendering bypass
              return (
                <div key={item._id || i} className='bg-gray-600 flex justify-between h-36 w-[60%] p-1 items-center rounded-lg shadow-md'>
                  <div className='flex gap-5'>
                    <img 
                      src={item?.image?.[0]} 
                      alt="image" 
                      className='h-32 w-32 object-cover mt-1 cursor-pointer rounded' 
                      onClick={() => { navigate('/user-product', { state: { product: item } }) }} 
                    />
                    <div>
                      <p className='text-xl font-semibold'>{item?.title}</p>
                      <p className='text-xl font-semibold text-green-500'>Rs. {item?.price}</p>
                      <p className='flex gap-2 mt-1 items-center'>
                        {/* 💡 FIXED: Sync actions with 'subtract' / 'add' string signatures properly */}
                        <span 
                          className='border-2 bg-gray-700 px-2 cursor-pointer select-none rounded font-bold' 
                          onClick={(e) => { e.stopPropagation(); editToCartGlobal(item, 'subtract', navigate) }}
                        >
                          -
                        </span>
                        <span className='border-2 bg-gray-700 px-3 py-0.5 rounded font-medium'>{currQuantity}</span>
                        <span 
                          className='border-2 bg-gray-700 px-2 cursor-pointer select-none rounded font-bold' 
                          onClick={(e) => { e.stopPropagation(); editToCartGlobal(item, 'add', navigate) }}
                        >
                          +
                        </span>
                      </p>
                      <p className='flex gap-4 mt-3'>
                        <button className='bg-blue-700 p-2 text-xs rounded hover:scale-105 active:scale-95 transition cursor-pointer'>Checkout this Product</button>
                        <button className='bg-red-500 p-2 text-xs rounded hover:scale-105 active:scale-95 transition cursor-pointer' onClick={()=>editToCartGlobal(item, "remove", navigate)}>Remove</button>
                      </p>
                    </div>
                  </div>
                  <p className='font-semibold mr-4 text-lg'>Rs. {currQuantity * (item?.price || 0)}</p>
                </div>
              )
            })}

            {productCart.length === 0 && (
              <div className='text-center mt-20 text-gray-400 text-xl font-medium'>
                Your cart is empty! 🛒
              </div>
            )}
          </div>
          <Footer />
        </div>
      )}
    </>
  )
}

export default CartPage;