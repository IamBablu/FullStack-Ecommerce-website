import React, { useContext, useState, useEffect } from 'react'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'
import ApprovedProduct from './ApprovedProduct'
import RejectedProduct from './RejectedProduct'

const ProductRequest = () => {
  const {serverUrl, userdata, setUserData, products, setProducts, vendors, setVendors} = useContext(userDataContext)
  const [selectedProduct, setSelectedProduct] = useState('') 
  const [rejected, setRejected] = useState(false)
  const [reason, setReason] = useState("")
  const [vendorDetails, setVendorDetails] = useState("")
  const [loading, setLoading] = useState(false)

  const [activePage, setActivePage] = useState("Pending")


  const getShopDetails = (vendorId) => {
    const main1 = vendors.filter((v) => v._id == vendorId)
    setVendorDetails(main1[0]);
  }


  const handleVerify = async (newStatus) => {
    try {
      setLoading(true)
      const result = await axios.patch(`${serverUrl}/admin/verify-product`, { status: newStatus, productId: selectedProduct._id, rejectedReason: reason }, { withCredentials: true })
      console.log(newStatus)
      console.log(result.data.data);
      setProducts(products.map((pro) => pro._id === result.data.data?._id? result.data.data: pro))
      setLoading(false)
      setSelectedProduct(null)
      setRejected(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      setSelectedProduct(null)
      setRejected(false)
    }
  }

  useEffect(() => {
      if (products.length > 0) {
        const isAlreadySorted = products.every((prod, i, arr) =>
          i === 0 || new Date(arr[i - 1].requestedAt) >= new Date(prod.requestedAt)
        );
        if (!isAlreadySorted) {
          const newestFirst = [...products].sort((a, b) => {
            return new Date(b.requestedAt) - new Date(a.requestedAt);
          });
  
          setProducts(newestFirst); // Ab yeh sahi jagah par hai (.sort ke bahar)
        }
      }
  
    }, [products, setProducts])
  return (
    <div className='bg-gray-200 h-full w-full pl-5 relative'>
    <div className='bg-gray-600 w-[95%] h-8 rounded-full flex justify-center gap-10'>
      <button className={`${activePage == 'Pending'? "bg-gray-800":"bg-gray-400"} px-5 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer`} onClick={()=> setActivePage("Pending")}>Pending</button>
      <button className={`${activePage == 'Approved'? "bg-gray-800":"bg-gray-400"} px-5 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer`} onClick={()=> setActivePage("Approved")}>Approved</button>
      <button className={`${activePage == 'Rejected'? "bg-gray-800":"bg-gray-400"} px-5 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer`} onClick={()=> setActivePage("Rejected")}>Rejected</button>
      
    </div>
    {activePage == "Pending" &&
      <div className='bg-gray-800 h-[95%] w-[95%] rounded-4xl overflow-y-scroll [&::-webkit-scrollbar]:w-0 px-10 py-4'>
        <h1 className='text-4xl font-semibold mb-5 text-yellow-500'>Product Approval Requests</h1>
        <table className='w-full table-fixed'>
          <thead className='bg-gray-500 text-2xl'>
            <tr >
              <th className='p-2 w-1/8'>Image</th>
              <th className='p-2'>Title</th>
              <th className='p-2 w-1/8'>Price</th>
              <th className='p-2 w-1/8'>Status</th>
              <th className='p-2 w-1/8'>Category</th>
              <th className='p-2 w-1/6'>Action</th>
            </tr>
          </thead>
          <tbody className='bg-gray-700'>
            {products?.map((product, indx) => {
              if(product.verificationStatus == "Pending"){
            return <tr key={indx} className='border-t-2 text-center'>
              <td className='pl-4 py-1'><img src={product.image[0]} className='h-20 w-20 rounded-lg object-cover' alt="product img" /></td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td><span className='bg-yellow-300/50 p-2 px-4 rounded-full'>{product.verificationStatus}</span></td>
              <td>{product.category}</td>
              <td className='wrap-break-word pr-4' onClick={() => setSelectedProduct(product)}><span className='bg-green-700 p-2 md:px-4 rounded-full hover:bg-green-900 transition-all duration-300 cursor-pointer'>Check Details</span></td>
            </tr>
            }})}


          </tbody>
        </table>
      </div>
      }
      {activePage == "Approved" && <ApprovedProduct />}
      {activePage == "Rejected" && <RejectedProduct />}
      {selectedProduct && <div className='w-full h-full bg-gray-600/60 absolute top-0 left-0 z-10 flex justify-center items-center'>
        <div className='bg-black w-[60%] rounded-2xl text-white p-8 flex flex-col gap-5 text-lg relative'>
          <h1 className='text-2xl'>Product Details</h1>
          <div className='flex gap-10 pr-10 text-center'>
            <img src={selectedProduct.image[0]} alt="product image" className='h-20 border-2' />
            <div className='w-full'>
              <p className='text-xl font-semibold'>Title</p>
              <p>{selectedProduct.title}</p>
            </div>
          </div>
          <div className='flex justify-around'>
            <div>
              <p className='text-xl font-semibold'>Price</p>
              <p>{selectedProduct.price}</p>
            </div>
            <div>
              <p className='text-xl font-semibold'>Status</p>
              <p>{selectedProduct.verificationStatus}</p>
            </div>
            <div>
              <p className='text-xl font-semibold'>Category</p>
              <p>{selectedProduct.category}</p>
            </div>
          </div>
          <p><span className='text-xl'>Description:</span> <br /> <span className='ml-20'>{selectedProduct.description}</span></p>
          <div className='flex justify-around'>
            <button className='bg-green-500 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition' onClick={()=> handleVerify("Approved")}>Approve</button>
            <button className='bg-red-500 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition' onClick={() => setRejected(true)}>Reject</button>
            <button className='bg-blue-500 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition' onClick={() => getShopDetails(selectedProduct.vendor)}>Shop Details</button>
            <button className='bg-gray-200 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition text-black' onClick={() => setSelectedProduct('')}>Cancel</button>
          </div>
          {rejected && <div className='flex flex-col items-center gap-2'>
            <textarea name="" id="" rows={3} value={reason} className='w-full border-4 outline-none bg-white border-blue-500 rounded-xl p-2 text-black' placeholder='Enter Rejection Reason' maxLength={100} onChange={(e)=> setReason(e.target.value)}></textarea>
            <p className='text-sm'>30/100</p>
            <div>
              <button className='bg-red-500 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition mr-10' onClick={()=> handleVerify("Rejected")}> Rejected </button>
              <button className='bg-gray-200 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition text-black' onClick={() => setRejected(false)}> Cancel </button>
            </div>
          </div>}

          {vendorDetails && <div className='absolute h-full w-full bg-black top-0 left-0 rounded-2xl px-10'>
            <h1 className='text-2xl font-semibold m-4'>Shop Details</h1>
            <p className='text-lg font-semibold'>Vendor Name:- <span className='text-blue-600'>{vendorDetails.fullName}</span></p>
            <p className='text-lg font-semibold'>Email:- <span className='text-blue-600'>{vendorDetails.email}</span></p>
            <p className='text-lg font-semibold'>Phone:- <span className='text-blue-600'>{vendorDetails.phone}</span></p>
            <p className='text-lg font-semibold'>Shop Name:- <span className='text-blue-600'>{vendorDetails.shopName}</span></p>
            <p className='text-lg font-semibold'>Shop Address:- <span className='text-blue-600'>{vendorDetails.shopAddress}</span></p>
            <p className='text-lg font-semibold'>GST Number:- <span className='text-blue-600'>{vendorDetails.gstNumber}</span></p>
            <button className='bg-gray-200 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition text-black mx-[35%] my-10' onClick={() => setVendorDetails('')}>Cancel</button>
          </div>}
        </div>
      </div>}
    </div>
  )
}

export default ProductRequest
