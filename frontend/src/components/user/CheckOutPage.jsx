import React, { useState } from 'react'
import logo from '../../assets/logo.jpeg'
import { useNavigate, useLocation } from 'react-router-dom'

const CheckOutPage = () => {
  const [selectedButton, setSelectedButton] = useState('Stripe')
  const serviceCharge = 50;
  const location = useLocation()
  const product = location?.state.product;
  const quantity = location?.state.quantity;
  const totalPrice = (product?.price * quantity) + (product?.deliveryCharge || 0) + serviceCharge;
console.log(product, quantity)

  const handleChange = async(e) => {
    const {name, value} = e.target;
    console.log(name, value)
  }
  return (
    <div className='h-screen w-screen bg-linear-to-b from-blue-700 to-black text-white flex justify-center items-center'>
      <div className='bg-gray-800 flex gap-5 p-10 rounded-xl shadow-lg shadow-blue-700 hover:shadow-xl hover:scale-105 transition'>
        <div>
          <h1 className='text-2xl'>Delivery Address</h1>
          <form className='w-80 p-4 space-y-3'>
          <input type="text" name="fullName" placeholder='Full Name' onChange={handleChange} className='border-2 w-full p-2'/>
          <input type="number" name="phone" placeholder='Phone Number' onChange={handleChange} className='border-2 w-full p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'/>
          <input type="text" name="address" placeholder='Complete Address' onChange={handleChange} className='border-2 w-full p-2'/>
          <div>
          <input type="text" name="city" placeholder='City' onChange={handleChange} className='border-2 w-[45%] p-2 mr-6'/>
          <input type="number" name="pin" placeholder='PinCode' onChange={handleChange} className='border-2 w-[45%] p-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'/>
          </div>

          </form>
        </div>
        <div>
          <h1 className='text-2xl'>Order Summary</h1>
          <div className='bg-gray-600 p-2 rounded-xl w-80 flex gap-2 items-center'>
            <img src={product?.image[0]} alt="image" className='h-16 w-16'/>
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
              <p>Rs. {product?.payOnDelivery? "0" : product?.deliveryCharge || 0}</p>
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
              <button className={`${selectedButton == 'Cash'? 'bg-blue-700' : 'bg-gray-600'} p-2 rounded-xl px-4 w-40 transition cursor-pointer hover:scale-105 active:scale-90`} onClick={()=> setSelectedButton("Cash")}>Cash On Delivery</button>
              <button className={`${selectedButton == 'Stripe'? 'bg-blue-700' : 'bg-gray-600'} p-2 rounded-xl px-4 w-40 transition cursor-pointer hover:scale-105 active:scale-90`} onClick={()=> setSelectedButton("Stripe")}>Stripe</button>
            </div>
            <button className='w-full bg-blue-700 p-2 rounded-2xl hover:scale-105 active:scale-90 cursor-pointer transition'>{selectedButton == "Cash"? "Confirm Order" : "Proceed to Secure Payment"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckOutPage
