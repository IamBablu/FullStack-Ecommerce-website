import React, { useContext, useState, useEffect } from 'react'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios';

const Orders = () => {
  const { activePage, setActivePage, serverUrl, userdata } = useContext(userDataContext)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [activeStatus, setActiveStatus] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const statusButtons = [
    { label: 'PENDING', value: 'pending', color: 'bg-yellow-500', bgColor: 'bg-yellow-900/30', borderColor: 'border-yellow-500' },
    { label: 'CONFIRMED', value: 'confirmed', color: 'bg-blue-500', bgColor: 'bg-blue-900/30', borderColor: 'border-blue-500' },
    { label: 'SHIPPED', value: 'shipped', color: 'bg-purple-500', bgColor: 'bg-purple-900/30', borderColor: 'border-purple-500' },
    { label: 'DELIVERED', value: 'delivered', color: 'bg-green-500', bgColor: 'bg-green-900/30', borderColor: 'border-green-500' },
    { label: 'RETURNED', value: 'returned', color: 'bg-red-500', bgColor: 'bg-red-900/30', borderColor: 'border-red-500' },
    { label: 'CANCELED', value: 'canceled', color: 'bg-gray-500', bgColor: 'bg-gray-900/30', borderColor: 'border-gray-500' }
  ]

  useEffect(() => {
    setActivePage("orders")
    getOrders()
  }, [])

  const getOrders = async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/order/get-vendor-order`, { withCredentials: true })
      console.log("Vendor orders:", result.data.data)
      setOrders(result.data.data)
      filterOrdersByStatus(result.data.data, activeStatus)
    } catch (error) {
      console.error(error)
      setOrders([])
      setFilteredOrders([])
    } finally {
      setLoading(false)
    }
  }

  const filterOrdersByStatus = (allOrders, status) => {
    if (status === 'all') {
      setFilteredOrders(allOrders)
    } else {
      setFilteredOrders(allOrders.filter(order => order.orderStatus === status))
    }
  }

  const handleStatusClick = (status) => {
    setActiveStatus(status)
    filterOrdersByStatus(orders, status)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true)
      console.log(orderId, newStatus)
      const result = await axios.put(`${serverUrl}/order/update-order-status/${orderId}`,
        { orderStatus: newStatus },
        { withCredentials: true }
      )
      if (result.data.success) {
        // Refresh orders
        await getOrders()
        setSelectedOrder(null)
        alert(`Order status updated to ${newStatus.toUpperCase()}`)
      }
    } catch (error) {
      console.error(error)
      alert('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500'
      case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500'
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500'
      case 'returned': return 'bg-red-500/20 text-red-400 border-red-500'
      case 'canceled': return 'bg-gray-500/20 text-gray-400 border-gray-500'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500'
    }
  }

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      pending: ['confirmed', 'canceled'],
      confirmed: ['shipped', 'canceled'],
      shipped: ['delivered', 'returned'],
      delivered: [],
      returned: [],
      canceled: []
    }
    return statusFlow[currentStatus] || []
  }

  return (
    <div className="w-full h-full py-4 bg-gradient-to-br from-gray-800 via-gray-800 to-black text-white overflow-y-scroll scroll-hidden">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Vendor Orders
          </h1>
          <p className="text-gray-400 mt-2">Manage and track all orders for your products</p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => handleStatusClick('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${activeStatus === 'all'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            ALL ORDERS ({orders.length})
          </button>
          {statusButtons.map((btn) => {
            const count = orders.filter(o => o.orderStatus === btn.value).length
            return (
              <button
                key={btn.value}
                onClick={() => handleStatusClick(btn.value)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${activeStatus === btn.value
                  ? `${btn.bgColor} ${btn.borderColor} border-2 shadow-lg scale-105 text-white`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                {btn.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeStatus === btn.value ? btn.color : 'bg-gray-600'
                  }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 text-lg">No orders found with status: {activeStatus.toUpperCase()}</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr className="text-left text-gray-300">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Buyer</th>
                  <th className="p-4 font-semibold">Products</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Update</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-sm">#{order._id.slice(-8)}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.buyer?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{order.userInfo?.email || order.buyer?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {order.products.map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">{item.product?.title || 'Product'}</span>
                            <span className="text-gray-400"> x {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${order.paymentMethod === 'cod' ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                        {order.paymentMethod?.toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">₹{order.totalAmount?.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                        disabled={updatingStatus}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="returned">Returned</option>
                        <option value="canceled">Canceled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Order ID</p>
                    <p className="font-mono">#{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Date</p>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Buyer Information</p>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p><span className="text-gray-400">Name:</span> {selectedOrder.buyer?.fullName}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.buyer?.email}</p>
                    <p><span className="text-gray-400">Phone:</span> {selectedOrder.userInfo?.phone}</p>
                    <p><span className="text-gray-400">Address:</span> {selectedOrder.userInfo?.address}, {selectedOrder.userInfo?.city} - {selectedOrder.userInfo?.pinCode}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Products</p>
                  <div className="space-y-2">
                    {selectedOrder.products.map((item, idx) => (
                      <div key={idx} className="bg-gray-700 rounded-lg p-3 flex justify-between">
                        <div>
                          <p className="font-medium">{item.product?.title}</p>
                          <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Payment Summary</p>
                  <div className="bg-gray-700 rounded-lg p-3 space-y-1">
                    <div className="flex justify-between">
                      <span>Product Total:</span>
                      <span>₹{selectedOrder.productTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge:</span>
                      <span>₹{selectedOrder.deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Charge:</span>
                      <span>₹{selectedOrder.serviceCharge}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-gray-600">
                      <span>Total Amount:</span>
                      <span>₹{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition"
                  >
                    Close
                  </button>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer pr-8"
                    disabled={updatingStatus}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="returned">Returned</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders