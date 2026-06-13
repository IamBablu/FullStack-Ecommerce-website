import React, { useContext, useState, useEffect } from 'react'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'
import { div } from 'motion/react-client'

const ProductRequest = () => {
  const { serverUrl, userdata, setUserData, products, setProducts, vendors, setVendors } = useContext(userDataContext)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [rejected, setRejected] = useState(false)
  const [reason, setReason] = useState("")
  const [vendorDetails, setVendorDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activePage, setActivePage] = useState("Pending")
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 })
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState([])

  // Calculate statistics
  useEffect(() => {
    if (products.length > 0) {
      setStats({
        pending: products.filter(p => p.verificationStatus === "Pending").length,
        approved: products.filter(p => p.verificationStatus === "Approved").length,
        rejected: products.filter(p => p.verificationStatus === "Rejected").length
      })
    }
  }, [products])

  // Filter products based on search
  useEffect(() => {
    let filtered = products.filter(p => p.verificationStatus === activePage)
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price?.toString().includes(searchTerm)
      )
    }
    setFilteredProducts(filtered)
  }, [products, activePage, searchTerm])

  const getShopDetails = (vendorId) => {
    const vendor = vendors.find((v) => v._id === vendorId)
    setVendorDetails(vendor)
  }

  const handleVerify = async (newStatus) => {
    if (newStatus === "Rejected" && !reason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    try {
      setLoading(true)
      const result = await axios.patch(`${serverUrl}/admin/verify-product`,
        { status: newStatus, productId: selectedProduct._id, rejectedReason: reason },
        { withCredentials: true }
      )

      if (result.data.success) {
        setProducts(products.map((pro) =>
          pro._id === result.data.data?._id ? result.data.data : pro
        ))
        alert(`Product ${newStatus.toLowerCase()} successfully!`)
      }

      setLoading(false)
      setSelectedProduct(null)
      setRejected(false)
      setReason("")
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to update product status')
      setLoading(false)
      setSelectedProduct(null)
      setRejected(false)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500'
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500'
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
    }
  }

  return (
    <div className='w-full h-full overflow-y-scroll scroll-hidden bg-linear-to-br from-gray-900 via-gray-800 to-black'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center'>
            Product Management Dashboard
          </h1>
          <p className='text-gray-400 text-center mt-2'>Manage and verify product requests from vendors</p>
        </div>



          {/* making tabs and search section sticky at top position */}
        <div className='sticky top-0 z-10 bg-gray-800 pt-4 px-2 rounded-lg transition-all duration-300'>
          <div className='md:flex gap-30'>

          {/* Tabs */}
          <div className='flex flex-wrap gap-3 mb-6 justify-center'>
            {['Pending', 'Approved', 'Rejected'].map((tab) => {
              const getTabColor = () => {
                if (tab === 'Pending') return 'bg-yellow-600 hover:bg-yellow-700';
                if (tab === 'Approved') return 'bg-green-600 hover:bg-green-700';
                return 'bg-red-600 hover:bg-red-700';
              };

              return (
                <button
                  key={tab}
                  className={`cursor-pointer px-1 text-sm md:px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${activePage === tab
                    ? `${getTabColor()} text-white shadow-lg scale-105`
                    : `${getTabColor()} text-white/70 opacity-70`
                    }`}
                  onClick={() => setActivePage(tab)}
                >
                  {tab} Products
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activePage === tab ? 'bg-white/20' : 'bg-black/20'
                    }`}>
                    {tab === 'Pending' ? stats.pending : tab === 'Approved' ? stats.approved : stats.rejected}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className='mb-6 pb-4 md:pb-0'>
            <div className='relative max-w-md'>
              <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type='text'
                placeholder={`Search ${activePage.toLowerCase()} products by title, category, or price...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors'
              />
            </div>
          </div>

        </div>
        </div>

        {/* Products Table */}
        <div className='hidden md:block bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-2xl'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-linear-to-r from-gray-700 to-gray-800'>
                <tr className='text-left'>
                  <th className='p-4 text-gray-200 font-semibold'>Image</th>
                  <th className='p-4 text-gray-200 font-semibold'>Product Name</th>
                  <th className='p-4 text-gray-200 font-semibold'>Price</th>
                  <th className='p-4 text-gray-200 font-semibold'>Category</th>
                  <th className='p-4 text-gray-200 font-semibold'>Vendor</th>
                  <th className='p-4 text-gray-200 font-semibold'>Status</th>
                  <th className='p-4 text-gray-200 font-semibold text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className='text-center py-12 text-gray-400'>
                      <div className='flex flex-col items-center gap-2'>
                        <svg className='w-12 h-12 text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p>No {activePage.toLowerCase()} products found</p>
                        {searchTerm && <p className='text-sm'>Try adjusting your search</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr key={product._id} className='border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-300 group'>
                      <td className='p-4'>
                        <img
                          src={product.image?.[0]}
                          className='h-16 w-16 rounded-lg object-cover border border-gray-600'
                          alt={product.title}
                        />
                      </td>
                      <td className='p-4'>
                        <p className='font-semibold text-white'>{product.title}</p>
                        <p className='text-xs text-gray-400'>{product.description?.substring(0, 50)}...</p>
                      </td>
                      <td className='p-4'>
                        <p className='font-semibold text-green-400'>₹{product.price?.toLocaleString()}</p>
                      </td>
                      <td className='p-4'>
                        <span className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs'>
                          {product.category}
                        </span>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-300'>{product.vendor?.shopName || 'N/A'}</p>
                      </td>
                      <td className='p-4'>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(product.verificationStatus)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${product.verificationStatus === 'Pending' ? 'bg-yellow-500 animate-pulse' :
                            product.verificationStatus === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                          {product.verificationStatus}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className='cursor-pointer bg-linear-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg'
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* // for small devices */}
        <div className='md:hidden'>
          {filteredProducts.length == 0 ? (
            <div className='flex flex-col items-center gap-2 py-4 my-4 bg-gray-800/50   backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-2xl'>
              <svg className='w-12 h-12 text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <p>No {activePage.toLowerCase()} products found</p>
              {searchTerm && <p className='text-sm'>Try adjusting your search</p>}
            </div>

          ) : (
            filteredProducts?.map((p, i) => (

              <div key={p._id} className='bg-gray-700 p-4 my-4 rounded-2xl'>
                <div className='flex justify-between'>
                  <div>
                    <p className='text-xl font-semibold mb-2'>Image</p>
                    <img
                      src={p.image?.[0]}
                      className='h-24 w-24 rounded-lg object-cover border border-gray-600'
                      alt={p.title}
                    />
                  </div>
                  <div>
                    <h4>Product Name :- </h4>
                    <p className='text-white'>{p.title}</p>
                    <p className='text-xs text-gray-400'>{p.description?.substring(0, 50)}...</p>
                  </div>
                </div>
                <div className='flex justify-between my-2 text-center'>
                  <div>
                    <h4>Price</h4>
                    <p className='font-semibold text-green-400'>₹{p.price?.toLocaleString()}</p>

                  </div>
                  <div>
                    <h4>Category</h4>
                    <span className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs'>
                      {p.category}
                    </span>
                  </div>
                  <div>
                    <h4>Vendor</h4>
                    <p className='text-gray-300'>{p.vendor?.shopName || 'N/A'}</p>

                  </div>
                </div>
                <div className='flex justify-between text-center mt-4'>
                  <div>
                    <h4>Status</h4>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(p.verificationStatus)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${p.verificationStatus === 'Pending' ? 'bg-yellow-500 animate-pulse' :
                            p.verificationStatus === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                          {p.verificationStatus}
                        </span>
                  </div>
                  <div>
                    <h4>Action</h4>
                    <button
                          onClick={() => setSelectedProduct(p)}
                          className='cursor-pointer bg-linear-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg'
                        >
                          View Details
                        </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>




        {/* Product Details Modal */}
        {selectedProduct && (
          <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-3 sm:p-4 md:p-6 overflow-y-auto scroll-hidden'>
  <div className='bg-linear-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl max-w-[95%] sm:max-w-[90%] md:max-w-3xl w-full shadow-2xl border border-gray-700 my-auto mx-auto'>
              {/* Modal Header */}
              <div className={`bg-linear-to-r p-6 rounded-t-2xl ${selectedProduct.verificationStatus === 'Approved' ? 'from-green-600 to-green-700' :
                selectedProduct.verificationStatus === 'Rejected' ? 'from-red-600 to-red-700' :
                  'from-blue-600 to-purple-600'
                }`}>
                <div className='flex justify-between items-center'>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>Product Details</h2>
                    <p className='text-white/80 mt-1'>Review product information</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProduct(null)
                      setRejected(false)
                      setReason("")
                    }}
                    className='cursor-pointer text-white hover:text-gray-200 transition-colors text-2xl w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center'
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className='px-4 pb-2'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Product Image */}
                  <div className='bg-gray-700/50 rounded-lg p-4 flex justify-center items-center'>
                    <img
                      src={selectedProduct.image?.[0]}
                      alt={selectedProduct.title}
                      className='max-h-64 rounded-lg object-contain'
                    />
                  </div>

                  {/* Product Info */}
                  <div className='space-y-2 mt-2'>
                    <div>
                      <p className='text-gray-400 text-sm'>Product Title</p>
                      <p className='text-white font-semibold text-lg'>{selectedProduct.title}</p>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Price</p>
                      <p className='text-green-400 font-bold text-2xl'>₹{selectedProduct.price?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Category</p>
                      <p className='text-white'>{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(selectedProduct.verificationStatus)}`}>
                        {selectedProduct.verificationStatus}
                      </span>
                    </div>
                    <div>
                      <p className='text-gray-400 text-sm'>Stock</p>
                      <p className='text-white'>{selectedProduct.stock || 0} units</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className='text-gray-400 text-sm mb-2'>Description</p>
                  <div className='bg-gray-700/50 rounded-lg p-4'>
                    <p className='text-white'>{selectedProduct.description}</p>
                  </div>
                </div>

                {/* Vendor Information */}
                <div className='my-2'>
                  {console.log(selectedProduct.vendor._id)}
                  <button
                    onClick={() => getShopDetails(selectedProduct.vendor._id)}
                    className='w-full cursor-pointer bg-purple-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-purple-700 transition-all duration-300'
                  >
                    View Vendor Details
                  </button>
                </div>

                {/* Rejection Reason Input */}
                {rejected && (
                  <div className='mt-6 bg-red-900/30 border border-red-700 rounded-lg p-4'>
                    <label className='text-red-300 font-semibold mb-2 block'>Rejection Reason *</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      maxLength={200}
                      rows={3}
                      placeholder='Please provide a detailed reason for rejection...'
                      className='w-full rounded-lg outline-none border border-red-600 bg-transparent text-white placeholder-gray-400 p-3 focus:border-red-500 transition-colors'
                    />
                    <p className="text-right text-xs text-gray-500 mt-1">
                      {reason.length}/200 characters
                    </p>
                  </div>
                )}

                {/* Action Buttons (only for pending products) */}
                {selectedProduct.verificationStatus === 'Pending' && (
                  <div className='flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-700'>
                    <button
                      className='cursor-pointer flex-1 bg-linear-to-r from-green-500 to-green-600 py-2.5 rounded-lg text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50'
                      onClick={() => handleVerify("Approved")}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : '✓ Approve Product'}
                    </button>

                    {!rejected ? (
                      <button
                        className='cursor-pointer flex-1 bg-linear-to-r from-red-500 to-red-600 py-2.5 rounded-lg text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg'
                        onClick={() => setRejected(true)}
                        disabled={loading}
                      >
                        ✕ Reject
                      </button>
                    ) : (
                      <button
                        className='cursor-pointer flex-1 bg-red-600 py-2.5 rounded-lg text-white font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50'
                        onClick={() => handleVerify("Rejected")}
                        disabled={loading || !reason.trim()}
                      >
                        {loading ? 'Processing...' : 'Confirm Rejection'}
                      </button>
                    )}

                    <button
                      className='cursor-pointer flex-1 bg-gray-600 py-2.5 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all duration-300'
                      onClick={() => {
                        setSelectedProduct(null)
                        setRejected(false)
                        setReason("")
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Vendor Details Modal */}
        {vendorDetails && (
          <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4'>
            <div className='bg-linear-to-br from-gray-800 to-gray-900 rounded-2xl max-w-lg w-full shadow-2xl border border-gray-700'>
              <div className='bg-linear-to-r from-purple-600 to-pink-600 p-6 rounded-t-2xl'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-2xl font-bold text-white'>Vendor Details</h2>
                  <button
                    onClick={() => setVendorDetails(null)}
                    className='cursor-pointer text-white hover:text-gray-200 transition-colors text-2xl'
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className='p-6 space-y-3'>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <p className='text-gray-400 text-sm'>Vendor Name</p>
                    <p className='text-white font-semibold'>{vendorDetails.fullName}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 text-sm'>Email</p>
                    <p className='text-white'>{vendorDetails.email}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 text-sm'>Phone</p>
                    <p className='text-white'>{vendorDetails.phone}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 text-sm'>Shop Name</p>
                    <p className='text-white font-semibold'>{vendorDetails.shopName}</p>
                  </div>
                  <div className='col-span-2'>
                    <p className='text-gray-400 text-sm'>Shop Address</p>
                    <p className='text-white'>{vendorDetails.shopAddress}</p>
                  </div>
                  <div className='col-span-2'>
                    <p className='text-gray-400 text-sm'>GST Number</p>
                    <p className='text-white'>{vendorDetails.gstNumber || 'N/A'}</p>
                  </div>
                </div>

                <button
                  className='cursor-pointer w-full bg-gray-600 py-2.5 rounded-lg text-white font-semibold hover:bg-gray-700 transition-all duration-300 mt-4'
                  onClick={() => setVendorDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default ProductRequest