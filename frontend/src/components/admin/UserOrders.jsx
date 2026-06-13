import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { userDataContext } from '../../context/UserContext'
import { useContext } from 'react'
import { useState } from 'react'

const UserOrders = () => {
  const { serverUrl } = useContext(userDataContext)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeStatus, setActiveStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    returned: 0,
    canceled: 0,
    totalRevenue: 0
  })

  const statusButtons = [
    { label: 'ALL', value: 'all', color: 'bg-gray-500' },
    { label: 'PENDING', value: 'pending', color: 'bg-yellow-500' },
    { label: 'CONFIRMED', value: 'confirmed', color: 'bg-blue-500' },
    { label: 'SHIPPED', value: 'shipped', color: 'bg-purple-500' },
    { label: 'DELIVERED', value: 'delivered', color: 'bg-green-500' },
    { label: 'RETURNED', value: 'returned', color: 'bg-red-500' },
    { label: 'CANCELED', value: 'canceled', color: 'bg-gray-500' }
  ]

  const getAllOrders = async () => {
    try {
      setLoading(true)
      const result = await axios.get(`${serverUrl}/order/get-admin-order`, { withCredentials: true })
      setOrders(result?.data?.data || [])
      setFilteredOrders(result?.data?.data || [])
      calculateStats(result?.data?.data || [])
    } catch (error) {
      console.error(error)
      setOrders([])
      setFilteredOrders([])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (ordersData) => {
    const newStats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.orderStatus === 'pending').length,
      confirmed: ordersData.filter(o => o.orderStatus === 'confirmed').length,
      shipped: ordersData.filter(o => o.orderStatus === 'shipped').length,
      delivered: ordersData.filter(o => o.orderStatus === 'delivered').length,
      returned: ordersData.filter(o => o.orderStatus === 'returned').length,
      canceled: ordersData.filter(o => o.orderStatus === 'canceled').length,
      totalRevenue: ordersData
        .filter(o => o.orderStatus === 'delivered')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    }
    setStats(newStats)
  }

  const filterOrders = (status, search) => {
    let filtered = [...orders]

    // Filter by status
    if (status !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === status)
    }

    // Filter by search term (order ID, buyer name, email)
    if (search) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.buyer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        order.buyer?.email?.toLowerCase().includes(search.toLowerCase()) ||
        order.userInfo?.phone?.toString().includes(search)
      )
    }

    setFilteredOrders(filtered)
  }

  const handleStatusClick = (status) => {
    setActiveStatus(status)
    filterOrders(status, searchTerm)
  }

  const handleSearch = (e) => {
    const search = e.target.value
    setSearchTerm(search)
    filterOrders(activeStatus, search)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await axios.put(
        `${serverUrl}/order/update-order-status/${orderId}`,
        { orderStatus: newStatus },
        { withCredentials: true }
      )
      if (result.data.success) {
        await getAllOrders()
        setSelectedOrder(null)
        alert(`Order status updated to ${newStatus.toUpperCase()}`)
      }
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to update order status')
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
  const allowStatusToUpdate = (status) => {
    const statusFlow = {
      pending: ["confirmed", "canceled"],
      confirmed: ["shipped", "canceled"],
      shipped: ["delivered", "returned", "canceled"],
      delivered: ["return"],
      returned: ["canceled"],
      canceled: []
    };
    return statusFlow[status]
  }
  useEffect(() => {
    getAllOrders()
  }, [])

  return (
    <div className="h-full overflow-y-scroll scroll-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard - Order Management
          </h1>
          <p className="text-gray-400 mt-2">View and manage all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-yellow-700">
            <p className="text-yellow-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-blue-700">
            <p className="text-blue-400 text-sm">Confirmed</p>
            <p className="text-2xl font-bold text-blue-400">{stats.confirmed}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-purple-700">
            <p className="text-purple-400 text-sm">Shipped</p>
            <p className="text-2xl font-bold text-purple-400">{stats.shipped}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-green-700">
            <p className="text-green-400 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-red-700">
            <p className="text-red-400 text-sm">Returned</p>
            <p className="text-2xl font-bold text-red-400">{stats.returned}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-indigo-700">
            <p className="text-indigo-400 text-sm">Revenue</p>
            <p className="text-2xl font-bold text-indigo-400">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Order ID, Buyer Name, Email, or Phone..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full md:w-96 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {statusButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => handleStatusClick(btn.value)}
              className={`cursor-pointer px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${activeStatus === btn.value
                  ? `${btn.color} text-white shadow-lg scale-105`
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {btn.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeStatus === btn.value ? 'bg-white/20' : 'bg-gray-600'
                }`}>
                {btn.value === 'all' ? stats.total : stats[btn.value]}
              </span>
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700 sticky top-0">
                <tr className="text-left text-gray-300">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Products</th>
                  <th className="p-4 font-semibold">Vendor</th>
                  <th className="p-4 font-semibold">Payment</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4">
                      <span className="font-mono text-sm">#{order._id.slice(-8)}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.buyer?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{order.buyer?.email || order.userInfo?.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {order.products.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-sm">
                            <span className="font-medium">{item.product?.title || 'Product'}</span>
                            <span className="text-gray-400"> x {item.quantity}</span>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <p className="text-xs text-gray-400">+{order.products.length - 2} more</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{order.productVendor?.fullName || 'N/A'}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${order.paymentMethod === 'cod' ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                        {order.paymentMethod?.toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">₹{order.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                        style={{ cursor: 'pointer' }}
                      >
                        <option value="">{order.orderStatus}</option>
                        {allowStatusToUpdate(order.orderStatus)?.map((s, i) => {
                          return <option key={i} value={s}>{s}</option>

                        })}
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
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 my-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white text-2xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Order Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Order ID</p>
                    <p className="font-mono text-sm">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Order Date</p>
                    <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Method</p>
                    <p>{selectedOrder.paymentMethod?.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Payment Status</p>
                    <p className={selectedOrder.isPaid ? 'text-green-400' : 'text-yellow-400'}>
                      {selectedOrder.isPaid ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                  <div className="bg-gray-700 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p><span className="text-gray-400">Name:</span> {selectedOrder.buyer?.fullName || selectedOrder.userInfo?.name}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.buyer?.email || selectedOrder.userInfo?.email}</p>
                    <p><span className="text-gray-400">Phone:</span> {selectedOrder.userInfo?.phone || selectedOrder.buyer?.phone}</p>
                    <p><span className="text-gray-400">Address:</span> {selectedOrder.userInfo?.address}, {selectedOrder.userInfo?.city} - {selectedOrder.userInfo?.pinCode}</p>
                  </div>
                </div>

                {/* Vendor Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Vendor Information</h3>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p><span className="text-gray-400">Name:</span> {selectedOrder.productVendor?.fullName}</p>
                    <p><span className="text-gray-400">Email:</span> {selectedOrder.productVendor?.email}</p>
                  </div>
                </div>

                {/* Products */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Products</h3>
                  <div className="space-y-2">
                    {selectedOrder.products.map((item, idx) => (
                      <div key={idx} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.product?.title}</p>
                          <p className="text-sm text-gray-400">Quantity: {item.quantity} | Price: ₹{item.price}</p>
                        </div>
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Summary</h3>
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

                {/* Status Update */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Update Status</h3>
                  <div className="flex gap-3">
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                      className="flex-1 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="returned">Returned</option>
                      <option value="canceled">Canceled</option>
                    </select>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserOrders