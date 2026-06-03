import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'

const Products = () => {
  const { serverUrl, userdata, setUserData, products, setProducts } = useContext(userDataContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Pending")
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(false)

  // Sort products by creation date
  useEffect(() => {
    if (products && products.length > 0) {
      const sortedProducts = [...products].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      setProducts(sortedProducts)
    }
  }, [])

  // Update stats whenever products change
  useEffect(() => {
    if (products && products.length > 0) {
      setStats({
        pending: products.filter(p => p.verificationStatus === "Pending").length,
        approved: products.filter(p => p.verificationStatus === "Approved").length,
        rejected: products.filter(p => p.verificationStatus === "Rejected").length
      })
    }
  }, [products])

  // Filter products based on active tab and search term
  useEffect(() => {
    if (products && products.length > 0) {
      let filtered = products.filter(p => p.verificationStatus === activeTab)
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.price?.toString().includes(searchTerm)
        )
      }
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [products, activeTab, searchTerm])

  const handleEnable = async (product) => {
    try {
      setLoading(true)
      const result = await axios.patch(`${serverUrl}/product/active-product`, 
        { isActive: !product.isActive, productId: product._id }, 
        { withCredentials: true }
      )
      if (result.data.success) {
        setProducts(products.map((pro) => 
          pro._id === result.data.data?._id ? result.data.data : pro
        ))
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      alert(error.response?.data?.message || 'Failed to update product status')
    }
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500'
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500'
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
    }
  }

  const getTabColor = (tab) => {
    if (tab === 'Pending') return 'bg-yellow-600 hover:bg-yellow-700'
    if (tab === 'Approved') return 'bg-green-600 hover:bg-green-700'
    return 'bg-red-600 hover:bg-red-700'
  }

  return (
    <div className='h-full overflow-y-scroll scroll-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
          <div>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              My Products
            </h1>
            <p className='text-gray-400 mt-2'>Manage and track all your products</p>
          </div>
          <button 
            className='bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg font-semibold flex items-center gap-2'
            onClick={() => navigate('/add-product')}
          >
            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Add New Product
          </button>
        </div>


        {/* Tabs & Search */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <div className='flex flex-wrap gap-3'>
            {['Pending', 'Approved', 'Rejected'].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? `${getTabColor(tab)} text-white shadow-lg scale-105 ring-2 ring-white/50`
                    : `${getTabColor(tab)} text-white/50 hover:text-white/80`
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab ? 'bg-white/20' : 'bg-black/30'
                }`}>
                  {tab === 'Pending' ? stats.pending : tab === 'Approved' ? stats.approved : stats.rejected}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className='relative'>
            <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type='text'
              placeholder={`Search ${activeTab.toLowerCase()} products...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full md:w-80 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors'
            />
          </div>
        </div>

        {/* Products Table */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 shadow-2xl overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-gray-700 to-gray-800'>
                <tr className='text-left'>
                  <th className='p-4 text-gray-200 font-semibold'>Image</th>
                  <th className='p-4 text-gray-200 font-semibold'>Product Name</th>
                  <th className='p-4 text-gray-200 font-semibold'>Price</th>
                  <th className='p-4 text-gray-200 font-semibold'>Status</th>
                  <th className='p-4 text-gray-200 font-semibold'>Active</th>
                  <th className='p-4 text-gray-200 font-semibold text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className='text-center py-12 text-gray-400'>
                      <div className='flex flex-col items-center gap-2'>
                        <svg className='w-12 h-12 text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p>No {activeTab.toLowerCase()} products found</p>
                        {searchTerm && <p className='text-sm'>Try adjusting your search</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product._id} className='border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-300 group'>
                      <td className='p-4'>
                        <img 
                          src={product.image?.[0]} 
                          className='h-16 w-16 rounded-lg object-cover border border-gray-600' 
                          alt={product.title}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64?text=No+Image'
                          }}
                        />
                       </td>
                      <td className='p-4'>
                        <p className='font-semibold text-white'>{product.title}</p>
                        <p className='text-xs text-gray-400'>{product.category}</p>
                      </td>
                      <td className='p-4'>
                        <p className='font-bold text-green-400'>₹{product.price?.toLocaleString()}</p>
                      </td>
                      <td className='p-4'>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(product.verificationStatus)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            product.verificationStatus === 'Pending' ? 'bg-yellow-500 animate-pulse' : 
                            product.verificationStatus === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          {product.verificationStatus}
                        </span>
                      </td>
                      <td className='p-4'>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          product.isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${product.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className='p-4'>
                        <div className='flex flex-col gap-2'>
                          <button 
                            className='bg-blue-500 px-4 py-1.5 rounded-lg text-white text-sm font-semibold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95'
                            onClick={() => navigate('/edit-product', { state: { product: product } })}
                          >
                            Edit
                          </button>
                          <button 
                            disabled={product.verificationStatus !== "Approved" || loading} 
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                              product.verificationStatus === "Approved" && !loading
                                ? `${product.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white cursor-pointer`
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                            onClick={() => handleEnable(product)}
                          >
                            {product.isActive ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rejection Info Cards (for rejected products) */}
        {activeTab === 'Rejected' && filteredProducts.some(p => p.rejectedReason) && (
          <div className='mt-6 space-y-3'>
            {filteredProducts.filter(p => p.rejectedReason).map(product => (
              <div key={product._id} className='bg-red-900/30 border border-red-700 rounded-lg p-4'>
                <div className='flex items-start gap-3'>
                  <svg className='w-5 h-5 text-red-400 mt-0.5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className='font-semibold text-red-400'>Rejection Reason for "{product.title}"</p>
                    <p className='text-red-300 mt-1'>{product.rejectedReason}</p>
                    <p className='text-sm text-red-400/70 mt-2'>💡 Tip: After editing, your product will be sent for re-verification automatically.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products