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
  const { serverUrl, cart, setCart } = useContext(userDataContext)
  const [paymentType, setPaymentType] = useState('stripe');
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
    console.log('hiii')
    try {
      const paymentMethod = paymentType.toLowerCase() || "cod";
      const orderData = {
        ...formData,
        paymentMethod
      }
      console.log("submited: ", orderData)
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
    <div className='h-screen w-screen overflow-x-hidden scroll-hidden'>
      <Navbar />
      <div className='h-full pb-30 bg-linear-to-b from-blue-700 to-black text-white flex justify-center items-center'>
        <div className='bg-gray-800 flex gap-5 p-10 rounded-xl shadow-lg shadow-blue-700 hover:shadow-xl hover:scale-105 transition'>
          <div>
            <h1 className='text-2xl'>Delivery Address</h1>
            <form className='w-80 p-4 space-y-3'>
              <input required type="text" name="name" placeholder='Full Name' onChange={handleChange} className='border-2 w-full p-2' />
              <input required type="number" name="phone" placeholder='Phone Number' onChange={handleChange} className='border-2 w-full p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' />
              <input required type="email" name="email" placeholder='Email Id' onChange={handleChange} className='border-2 w-full p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' />
              <input required type="text" name="address" placeholder='Complete Address' onChange={handleChange} className='border-2 w-full p-2' />
              <div>
                <input required type="text" name="city" placeholder='City' onChange={handleChange} className='border-2 w-[45%] p-2 mr-6' />
                <input required type="number" name="pinCode" placeholder='PinCode' onChange={handleChange} className='border-2 w-[45%] p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' />
              </div>

            </form>
          </div>
          <div>
            <h1 className='text-2xl'>Order Summary</h1>
            <div className='bg-gray-600 p-2 rounded-xl w-80 flex gap-2 items-center'>
              <img src={product?.image[0]} alt="image" className='h-16 w-16' />
              <div className='text-lg'>
                <p className='h-8 overflow-y-hidden w-40'>{product.title}</p>
                <p>Qty: {quantity}</p>
              </div>
              <p className='text-green-500 font-semibold w-54'>Rs. {product.price}</p>

            </div>
            <div className='my-2'>
              <div className='flex justify-between'>
                <p>Price: </p>
                <p>{`${quantity} X ${product?.price}`}</p>
                <p>{quantity * product?.price}</p>
              </div>
              <div className='flex justify-between'>
                <p>Delivery Charge: </p>
                <p>Rs. {product?.payOnDelivery ? "0" : product?.deliveryCharge || 0}</p>
              </div>
              <div className='flex justify-between'>
                <p>Service Charge: </p>
                <p>Rs. {serviceCharge}</p>
              </div>
              <h1 className='h-0.5 w-full bg-white'></h1>
              <div className='flex justify-between text-xl font-semibold'>
                <p >Total: </p>
                <p className='text-green-500'>Rs. {totalPrice}</p>
              </div>
              <h2 className='text-2xl'>Payment Method</h2>
              <div className='my-3 space-x-2'>
                <button className={`${paymentType == 'cod' ? 'bg-blue-700' : 'bg-gray-600'} p-2 rounded-xl px-4 w-40 transition cursor-pointer hover:scale-105 active:scale-90`} onClick={() => setPaymentType("cod")}>Cash On Delivery</button>
                <button className={`${paymentType == 'stripe' ? 'bg-blue-700' : 'bg-gray-600'} p-2 rounded-xl px-4 w-40 transition cursor-pointer hover:scale-105 active:scale-90`} onClick={() => setPaymentType("stripe")}>Stripe</button>
              </div>
              <button onClick={handleSubmit} className='w-full bg-blue-700 p-2 rounded-2xl hover:scale-105 active:scale-90 cursor-pointer transition'>{paymentType == "cod" ? "Confirm Order" : "Proceed to Secure Payment"}</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CheckOutPage
