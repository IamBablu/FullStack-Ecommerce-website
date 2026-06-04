import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar';
import Footer from './Footer'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios';

const Orders = () => {
  const { serverUrl, userdata, setUserData, activePage, setActivePage } = useContext(userDataContext)
  const [orders, setOrders] = useState([])
  const [selectOrder, setSelectOrder] = useState(null)
  const [trackOrder, setTrackOrder] = useState(null);

  useEffect(() => {
    setActivePage("Orders")
    const getUserData = async () => {
      try {
        const result = await axios.get(`${serverUrl}/order/get-user-order`, { withCredentials: true })
        setOrders(result?.data?.data)
      } catch (error) {
        console.error(error)
        setOrders([])
      }
    }
    getUserData();
  }, [userdata])

  const cancelOrder = async (orderId) => {
    try {
      const result = await axios.put(`${serverUrl}/order/cancel-order/${orderId}`, {}, { withCredentials: true })
      if (result.data.success) {
        const updatedOrders = await axios.get(`${serverUrl}/order/get-user-order`, { withCredentials: true })
        setOrders(updatedOrders.data.data)
        setSelectOrder(null)
        alert('Order canceled successfully')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to cancel order')
    }
  }

  const OrderTracker = ({ trackOrder }) => {
  const statusSteps = ['pending', 'confirmed', 'shipped', 'delivered', 'returned', 'canceled'];
  const currentStatusIndex = statusSteps.indexOf(trackOrder?.orderStatus?.toLowerCase());

  // Make all completed steps (including current) BLUE
  const getStatusBgColor = (index) => {
    if (index <= currentStatusIndex) {
      return 'bg-blue-500'; // All completed steps are blue
    }
    return 'bg-gray-600'; // Future steps are gray
  };

  const getStatusTextColor = (index) => {
    if (index <= currentStatusIndex) {
      return 'text-blue-500'; // All completed steps have blue text
    }
    return 'text-gray-500'; // Future steps have gray text
  };

  return (
    <div className="space-y-2">
      {/* Delivery Address Section */}
      <div className="bg-gray-800 rounded-lg px-4 py-1 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-1">Complete Delivery Address</h3>
        <div className="text-gray-300">
          <p><span className="font-medium text-gray-400">Buyer Name:</span> {trackOrder?.userInfo?.name || 'N/A'}</p>
          <p><span className="font-medium text-gray-400">Delivery Address:</span> {trackOrder?.userInfo?.address || 'N/A'}</p>
          <p><span className="font-medium text-gray-400">City:</span> {trackOrder?.userInfo?.city || 'N/A'}</p>
          <p><span className="font-medium text-gray-400">Postal Code:</span> {trackOrder?.userInfo?.pinCode || 'N/A'}</p>
          <p><span className="font-medium text-gray-400">Mobile no:</span> {trackOrder?.userInfo?.phone || 'N/A'}</p>
        </div>
      </div>

      {/* Order Status Timeline - Vertical Style */}
      <div className="bg-gray-800 rounded-lg px-6 py-2 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-2">Order Status</h3>
        <div className="space-x-0 flex">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            
            // Don't show future steps if order is returned or canceled
            if ((trackOrder?.orderStatus?.toLowerCase() === 'returned' || trackOrder?.orderStatus?.toLowerCase() === 'canceled') && index > currentStatusIndex) return null;
            
            return (
              <div key={step} className="flex flex-col items-start gap-4">
                {/* Status Circle with Line */}
                <div className="flex items-center">
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${getStatusBgColor(index)}
                    ${isCurrent ? 'ring-4 ring-blue-500 ring-opacity-30 scale-110' : ''}`}>
                    {isCompleted ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <span className="text-white text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  {/* Connecting Line */}
                  {index < statusSteps.length - 1 && (
                    <div className={`w-18 h-0.5 mt-1 transition-all duration-300 
                      ${index < currentStatusIndex ? 'bg-blue-500' : 'bg-gray-600'}`} />
                  )}
                </div>

                {/* Status Text */}
                <div className="flex-1 pb-6">
                  <p className={`font-semibold text-lg transition-all duration-300 ${getStatusTextColor(index)}`}>
                    {step.charAt(0).toUpperCase() + step.slice(1)}
                  </p>
                  {isCurrent && trackOrder?.orderStatus?.toLowerCase() !== 'delivered' && 
                   trackOrder?.orderStatus?.toLowerCase() !== 'returned' && 
                   trackOrder?.orderStatus?.toLowerCase() !== 'canceled' && (
                    <p className="text-sm text-gray-400 mt-1">
                      Your order is currently {step}
                    </p>
                  )}
                  {step === 'delivered' && isCompleted && (
                    <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                      <span>✓</span> Order delivered successfully on {new Date(trackOrder?.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                  {step === 'returned' && isCompleted && (
                    <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                      <span>⚠</span> Order has been returned
                    </p>
                  )}
                  {step === 'canceled' && isCompleted && (
                    <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                      <span>✕</span> Order has been canceled
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Card for Canceled/Returned Orders */}
      {trackOrder?.orderStatus?.toLowerCase() === 'canceled' && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 text-center font-medium">
            This order has been canceled
          </p>
        </div>
      )}
      {trackOrder?.orderStatus?.toLowerCase() === 'returned' && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
          <p className="text-red-300 text-center font-medium">
            This order has been returned
          </p>
        </div>
      )}
    </div>
  );
};
  return (
    <div className='h-screen w-full overflow-x-hidden scroll-hidden'>
      <Navbar />
      <div className='px-25 py-5 bg-linear-to-b from-blue-950 to-black text-white min-h-screen'>
        <h1 className='text-2xl font-bold'>My Orders</h1>
        <p>All orders Placed by you</p>
        
        <div className='border-2 border-white mt-4 overflow-x-auto'>
          <table className='w-full rounded-xl overflow-hidden'>
            <thead className='bg-gray-500'>
              <tr className='text-left font-semibold'>
                <th scope="col" className='p-2'>ORDER ID</th>
                <th scope="col" className='p-2'>DATE</th>
                <th scope="col" className='p-2'>PRODUCT</th>
                <th scope="col" className='p-2'>VENDOR</th>
                <th scope="col" className='p-2'>PAYMENT</th>
                <th scope="col" className='p-2'>TOTAL</th>
                <th scope="col" className='p-2'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className='border-b border-gray-600 hover:bg-gray-700'>
                  <td className='p-2 text-sm'>{order._id.slice(-8)}</td>
                  <td className='p-2'>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className='p-2'>{order.products[0]?.product?.title || 'N/A'}</td>
                  <td className='p-2'>{order.productVendor?.fullName || 'N/A'}</td>
                  <td className='p-2 text-center'>
                    <div>{order.paymentMethod?.toUpperCase() || 'N/A'}</div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.orderStatus?.toLowerCase() === 'pending' ? 'bg-yellow-600' : 
                      order.orderStatus?.toLowerCase() === 'delivered' ? 'bg-green-600' : 
                      order.orderStatus?.toLowerCase() === 'canceled' ? 'bg-red-600' : 'bg-blue-600'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className='p-2'>₹{order.totalAmount?.toLocaleString()}</td>
                  <td className='p-2 space-x-2'>
                    <button 
                      onClick={() => setSelectOrder(order)} 
                      className='bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 cursor-pointer hover:scale-105 active:scale-90 transition'
                    >
                      Check Details
                    </button>
                    <button 
                      onClick={() => setTrackOrder(order)} 
                      className='bg-green-500 px-3 py-1 rounded hover:bg-green-600 cursor-pointer hover:scale-105 active:scale-90 transition'
                    >
                      Track Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details Modal */}
        {selectOrder && (
          <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-y-auto'>
            <div className='bg-gray-700 rounded-lg p-6 max-w-md w-full mx-4 my-8'>
              <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Order Details: <span className='text-lg'>#{selectOrder._id.slice(-8)}</span></h1>
                <button
                  onClick={() => setSelectOrder(null)}
                  className='text-gray-400 hover:text-white text-xl cursor-pointer'
                >
                  ✕
                </button>
              </div>

              <p className='text-gray-300 mb-2'>
                Date: {new Date(selectOrder.createdAt).toLocaleDateString()}
              </p>

              <h2 className='text-xl font-semibold mb-2'>Product</h2>
              <div className='bg-gray-500 rounded p-3 mb-4'>
                <p className='font-medium'>{selectOrder.products[0]?.product?.title || 'N/A'}</p>
                <p className='text-sm text-gray-200'>
                  Quantity: {selectOrder.products[0]?.quantity || 0} | Price: ₹{selectOrder.products[0]?.price || 0}
                </p>
              </div>

              <h2 className='text-xl font-semibold mb-2'>Invoice</h2>
              <div className='space-y-2 mb-4'>
                <p className='flex justify-between'>
                  <span>Product Total:</span>
                  <span>₹{selectOrder.productTotal || (selectOrder.products[0]?.quantity * selectOrder.products[0]?.price) || 0}</span>
                </p>
                <p className='flex justify-between'>
                  <span>Delivery Charge:</span>
                  <span>₹{selectOrder.deliveryCharge || 0}</span>
                </p>
                <p className='flex justify-between'>
                  <span>Service Charge:</span>
                  <span>₹{selectOrder.serviceCharge || 0}</span>
                </p>
                <p className='flex justify-between bg-gray-600 p-2 rounded font-semibold'>
                  <span>Final Amount:</span>
                  <span>₹{selectOrder.totalAmount || 0}</span>
                </p>
              </div>

              <div className='flex gap-3'>
                <button
                  onClick={() => setSelectOrder(null)}
                  className='flex-1 bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 cursor-pointer hover:scale-105 active:scale-90 transition'
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectOrder(null);
                    setTrackOrder(selectOrder);
                  }}
                  className='flex-1 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 cursor-pointer hover:scale-105 active:scale-90 transition'
                >
                  Track Order
                </button>
                <button
                  onClick={() => cancelOrder(selectOrder._id)}
                  className='flex-1 bg-red-500 px-4 py-2 rounded hover:bg-red-600 cursor-pointer hover:scale-105 active:scale-90 transition'
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Track Order Modal */}
        {trackOrder && (
          <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-y-auto'>
            <div className='scroll-hidden bg-gray-900 rounded-lg px-6 py-2 max-w-2xl w-full mx-4 my-2 overflow-y-scroll'>
              <div className='flex justify-between items-center mb-2'>
                <h1 className='text-2xl font-bold text-white'>Track Order: <span className='text-lg text-gray-400'>#{trackOrder._id.slice(-8)}</span></h1>
                <button
                  onClick={() => setTrackOrder(null)}
                  className='text-gray-400 hover:text-white text-2xl cursor-pointer'
                >
                  ✕
                </button>
              </div>
              <OrderTracker trackOrder={trackOrder} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Orders