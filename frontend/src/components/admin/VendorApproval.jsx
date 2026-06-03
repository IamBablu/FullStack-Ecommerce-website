import React, { useEffect, useState } from 'react'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'

const VendorApproval = () => {
  const { serverUrl, vendors, setVendors } = React.useContext(userDataContext)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [status, setStatus] = useState('Pending')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [allVendors, setAllVendors] = useState([])
  const [filterType, setFilterType] = useState('pending') // pending, approved, rejected, all
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [activeTab, setActiveTab] = useState('basic')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredVendors, setFilteredVendors] = useState([])

  // Fetch all vendors from API
  const fetchAllVendors = async () => {
    try {
      const result = await axios.get(`${serverUrl}/admin/get-vendors`, { withCredentials: true })
      if (result.data.success) {
        setAllVendors(result.data.data)
        setVendors(result.data.data)
        calculateStats(result.data.data)
      }
    } catch (error) {
      console.error('Error fetching vendors:', error)
    }
  }

  const calculateStats = (vendorsData) => {
    setStats({
      total: vendorsData?.length || 0,
      pending: vendorsData?.filter(v => v.verificationStatus === "Pending").length || 0,
      approved: vendorsData?.filter(v => v.verificationStatus === "Approved").length || 0,
      rejected: vendorsData?.filter(v => v.verificationStatus === "Rejected").length || 0
    })
  }

  const handleVerify = async (newStatus) => {
    if (newStatus === 'Rejected' && !reason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    
    try {
      setLoading(true)
      const result = await axios.patch(`${serverUrl}/admin/verify-vendor`, 
        { status: newStatus, vendorId: selectedVendor._id, rejectedReason: reason }, 
        { withCredentials: true }
      )
      if (result.data.success) {
        // Refresh vendors list
        await fetchAllVendors()
        setStatus("Pending")
        setSelectedVendor(null)
        setReason('')
        alert(`Vendor ${newStatus.toLowerCase()} successfully!`)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to update vendor status')
      setLoading(false)
    }
  }

  // Filter vendors based on filter type and search
  useEffect(() => {
    let filtered = [...allVendors]
    
    // Apply status filter
    if (filterType !== 'all') {
      filtered = filtered.filter(v => 
        v.verificationStatus?.toLowerCase() === filterType.toLowerCase()
      )
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vendor => 
        vendor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone?.includes(searchTerm) ||
        vendor.gstNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredVendors(filtered)
  }, [filterType, searchTerm, allVendors])

  useEffect(() => {
    fetchAllVendors()
  }, [])

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-500/20 text-green-400 border-green-500'
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500'
      case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return '✓'
      case 'Rejected': return '✕'
      case 'Pending': return '⏳'
      default: return '•'
    }
  }

  return (
    <div className='h-full overflow-y-scroll scroll-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center'>
            Vendor Management Dashboard
          </h1>
          <p className='text-gray-400 text-center mt-2'>Manage and verify vendor applications</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <div 
            onClick={() => setFilterType('all')}
            className={`bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer ${filterType === 'all' ? 'ring-2 ring-white scale-105' : ''}`}
          >
            <p className='text-blue-100 text-sm'>Total Vendors</p>
            <p className='text-3xl font-bold text-white'>{stats.total}</p>
          </div>
          <div 
            onClick={() => setFilterType('pending')}
            className={`bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer ${filterType === 'pending' ? 'ring-2 ring-white scale-105' : ''}`}
          >
            <p className='text-yellow-100 text-sm'>Pending Approval</p>
            <p className='text-3xl font-bold text-white'>{stats.pending}</p>
          </div>
          <div 
            onClick={() => setFilterType('approved')}
            className={`bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer ${filterType === 'approved' ? 'ring-2 ring-white scale-105' : ''}`}
          >
            <p className='text-green-100 text-sm'>Approved</p>
            <p className='text-3xl font-bold text-white'>{stats.approved}</p>
          </div>
          <div 
            onClick={() => setFilterType('rejected')}
            className={`bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-4 shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer ${filterType === 'rejected' ? 'ring-2 ring-white scale-105' : ''}`}
          >
            <p className='text-red-100 text-sm'>Rejected</p>
            <p className='text-3xl font-bold text-white'>{stats.rejected}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className='mb-6'>
          <div className='relative max-w-md'>
            <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              type='text'
              placeholder='Search vendors by name, shop, email, phone, or GST...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors'
            />
          </div>
        </div>

        {/* Table */}
        <div className='bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-2xl'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gradient-to-r from-gray-700 to-gray-800'>
                <tr className='text-left'>
                  <th className='p-4 text-gray-200 font-semibold'>#</th>
                  <th className='p-4 text-gray-200 font-semibold'>Vendor Name</th>
                  <th className='p-4 text-gray-200 font-semibold'>Shop Name</th>
                  <th className='p-4 text-gray-200 font-semibold'>Contact</th>
                  <th className='p-4 text-gray-200 font-semibold'>GST</th>
                  <th className='p-4 text-gray-200 font-semibold'>Status</th>
                  <th className='p-4 text-gray-200 font-semibold text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className='text-center py-12 text-gray-400'>
                      <div className='flex flex-col items-center gap-2'>
                        <svg className='w-12 h-12 text-gray-500' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p>No vendors found</p>
                        {searchTerm && <p className='text-sm'>Try adjusting your search</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVendors?.map((vendor, index) => (
                    <tr key={vendor._id} className='border-b border-gray-700 hover:bg-gray-700/50 transition-all duration-300 group'>
                      <td className='p-4 text-gray-400'>{index + 1}</td>
                      <td className='p-4'>
                        <div>
                          <p className='font-semibold text-white'>{vendor.fullName}</p>
                          <p className='text-xs text-gray-400'>{vendor.email}</p>
                        </div>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-300'>{vendor.shopName}</p>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-300'>{vendor.phone}</p>
                      </td>
                      <td className='p-4'>
                        <p className='text-gray-300 text-sm'>{vendor.gstNumber || 'N/A'}</p>
                      </td>
                      <td className='p-4'>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(vendor.verificationStatus)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${vendor.verificationStatus === 'Pending' ? 'bg-yellow-500 animate-pulse' : ''}`}></span>
                          {getStatusIcon(vendor.verificationStatus)} {vendor.verificationStatus}
                        </span>
                      </td>
                      <td className='p-4 text-center'>
                        <button 
                          onClick={() => setSelectedVendor(vendor)} 
                          className='bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 rounded-lg text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg'
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

        {/* Vendor Details Modal */}
        {selectedVendor && (
          <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto'>
            <div className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-gray-700 transform transition-all duration-300 scale-100'>
              {/* Modal Header */}
              <div className={`bg-gradient-to-r p-6 rounded-t-2xl ${
                selectedVendor.verificationStatus === 'Approved' ? 'from-green-600 to-green-700' :
                selectedVendor.verificationStatus === 'Rejected' ? 'from-red-600 to-red-700' :
                'from-blue-600 to-purple-600'
              }`}>
                <div className='flex justify-between items-center'>
                  <div>
                    <h2 className='text-2xl font-bold text-white'>Vendor Details</h2>
                    <p className='text-white/80 mt-1'>Complete vendor information</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedVendor(null)
                      setStatus("Pending")
                      setReason('')
                      setActiveTab('basic')
                    }}
                    className='text-white hover:text-gray-200 transition-colors text-2xl w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center'
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className='border-b border-gray-700'>
                <div className='flex flex-wrap gap-2 p-4'>
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === 'basic' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Basic Information
                  </button>
                  <button
                    onClick={() => setActiveTab('business')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === 'business' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Business Details
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === 'documents' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('statistics')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === 'statistics' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    Statistics
                  </button>
                  {selectedVendor.verificationStatus === 'Rejected' && (
                    <button
                      onClick={() => setActiveTab('rejection')}
                      className={`px-4 py-2 rounded-lg font-semimibold transition-all duration-300 ${
                        activeTab === 'rejection' 
                          ? 'bg-red-600 text-white' 
                          : 'text-red-400 hover:text-white hover:bg-red-900/50'
                      }`}
                    >
                      Rejection Info
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className='p-6 max-h-[60vh] overflow-y-auto'>
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Full Name</p>
                        <p className='text-white font-semibold text-lg'>{selectedVendor?.fullName}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Email Address</p>
                        <p className='text-white font-semibold break-all'>{selectedVendor?.email}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Phone Number</p>
                        <p className='text-white font-semibold text-lg'>{selectedVendor?.phone}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Alternate Phone</p>
                        <p className='text-white font-semibold'>{selectedVendor?.alternatePhone || 'N/A'}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Registration Date</p>
                        <p className='text-white font-semibold'>{new Date(selectedVendor?.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(selectedVendor?.verificationStatus)}`}>
                          {selectedVendor?.verificationStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Business Details Tab */}
                {activeTab === 'business' && (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Shop Name</p>
                        <p className='text-white font-semibold text-lg'>{selectedVendor?.shopName}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Business Type</p>
                        <p className='text-white font-semibold'>{selectedVendor?.businessType || 'N/A'}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4 md:col-span-2'>
                        <p className='text-gray-400 text-sm mb-1'>Shop Address</p>
                        <p className='text-white font-semibold'>{selectedVendor?.shopAddress}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>City</p>
                        <p className='text-white font-semibold'>{selectedVendor?.city || 'N/A'}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>State</p>
                        <p className='text-white font-semibold'>{selectedVendor?.state || 'N/A'}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>Pincode</p>
                        <p className='text-white font-semibold'>{selectedVendor?.pincode || 'N/A'}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>GST Number</p>
                        <p className='text-white font-semibold'>{selectedVendor?.gstNumber || 'N/A'}</p>
                      </div>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-1'>PAN Number</p>
                        <p className='text-white font-semibold'>{selectedVendor?.panNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-2'>GST Certificate</p>
                        {selectedVendor?.gstCertificate ? (
                          <a 
                            href={selectedVendor?.gstCertificate} 
                            target='_blank' 
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 text-blue-400 hover:text-blue-300'
                          >
                            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            View Document
                          </a>
                        ) : (
                          <p className='text-gray-400'>Not uploaded</p>
                        )}
                      </div>
                      
                      <div className='bg-gray-700/50 rounded-lg p-4'>
                        <p className='text-gray-400 text-sm mb-2'>PAN Card</p>
                        {selectedVendor?.panCard ? (
                          <a 
                            href={selectedVendor?.panCard} 
                            target='_blank' 
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-2 text-blue-400 hover:text-blue-300'
                          >
                            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            View Document
                          </a>
                        ) : (
                          <p className='text-gray-400'>Not uploaded</p>
                        )}
                      </div>

                      <div className='bg-gray-700/50 rounded-lg p-4 md:col-span-2'>
                        <p className='text-gray-400 text-sm mb-2'>Shop Photos</p>
                        {selectedVendor?.shopPhotos && selectedVendor.shopPhotos.length > 0 ? (
                          <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                            {selectedVendor.shopPhotos.map((photo, idx) => (
                              <a 
                                key={idx}
                                href={photo} 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='text-blue-400 hover:text-blue-300 text-sm'
                              >
                                Photo {idx + 1}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className='text-gray-400'>No shop photos uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistics Tab */}
                {activeTab === 'statistics' && (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      <div className='bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4'>
                        <p className='text-blue-100 text-sm'>Total Products</p>
                        <p className='text-2xl font-bold text-white'>{selectedVendor?.totalProducts || 0}</p>
                      </div>
                      <div className='bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4'>
                        <p className='text-purple-100 text-sm'>Total Orders</p>
                        <p className='text-2xl font-bold text-white'>{selectedVendor?.totalOrders || 0}</p>
                      </div>
                      <div className='bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4'>
                        <p className='text-green-100 text-sm'>Total Revenue</p>
                        <p className='text-2xl font-bold text-white'>₹{selectedVendor?.totalRevenue?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rejection Info Tab */}
                {activeTab === 'rejection' && selectedVendor.verificationStatus === 'Rejected' && (
                  <div className='space-y-4'>
                    <div className='bg-red-900/30 border border-red-700 rounded-lg p-4'>
                      <p className='text-red-400 text-sm mb-2'>Rejection Reason</p>
                      <p className='text-red-300'>{selectedVendor?.rejectedReason || 'No reason provided'}</p>
                      {selectedVendor?.rejectedAt && (
                        <p className='text-red-400 text-xs mt-2'>Rejected on: {new Date(selectedVendor.rejectedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons (only show for pending vendors) */}
                {selectedVendor.verificationStatus === 'Pending' && (
                  <>
                    {status === "Rejected" && (
                      <div className='mt-6 bg-red-900/30 border border-red-700 rounded-lg p-4'>
                        <label className='text-red-300 font-semibold mb-2 block'>Rejection Reason *</label>
                        <textarea 
                          value={reason} 
                          onChange={(e) => setReason(e.target.value)} 
                          maxLength={200} 
                          rows={3} 
                          placeholder='Please provide a detailed reason for rejection...' 
                          className='w-full rounded-lg outline-none border border-red-600 bg-transparent text-white placeholder-gray-400 p-3 focus:border-red-500 transition-colors'
                        ></textarea>
                        <p className="text-right text-xs text-gray-500 mt-1">
                          {reason.length}/200 characters
                        </p>
                      </div>
                    )}

                    <div className='flex flex-wrap gap-3 pt-6 mt-4 border-t border-gray-700'>
                      <button 
                        className='flex-1 bg-gradient-to-r from-green-500 to-green-600 py-3 rounded-lg text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={() => handleVerify('Approved')}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : '✓ Approve Vendor'}
                      </button>
                      
                      {status !== "Rejected" ? (
                        <button 
                          className='flex-1 bg-gradient-to-r from-red-500 to-red-600 py-3 rounded-lg text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg'
                          onClick={() => setStatus("Rejected")}
                          disabled={loading}
                        >
                          ✕ Reject
                        </button>
                      ) : (
                        <button 
                          className='flex-1 bg-red-600 py-3 rounded-lg text-white font-semibold hover:bg-red-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                          onClick={() => handleVerify('Rejected')}
                          disabled={loading || !reason.trim()}
                        >
                          {loading ? 'Processing...' : 'Confirm Rejection'}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorApproval