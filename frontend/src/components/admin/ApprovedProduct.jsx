import React, { useContext, useState } from 'react'
import { userDataContext } from '../../context/UserContext'


const ApprovedProduct = () => {
    const { products, vendors } = useContext(userDataContext)
    const [selectedProduct, setSelectedProduct] = useState('')
    const [vendorDetails, setVendorDetails] = useState("")

    const getShopDetails = (vendorId) => {
        const main1 = vendors.filter((v) => v._id == vendorId)
        setVendorDetails(main1[0]);
    }

    return (
        <div className='h-full w-full'>
            <div className='bg-gray-800 h-[95%] w-[95%] rounded-4xl overflow-y-scroll [&::-webkit-scrollbar]:w-0 px-10 py-4'>
                <h1 className='text-4xl font-semibold mb-5 text-green-600'>Approved Products</h1>
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
                            if (product.verificationStatus == "Approved") {
                                return <tr key={indx} className='border-t-2 text-center'>
                                    <td className='pl-4 py-1'><img src={product.image[0]} className='h-20 w-20 rounded-lg object-cover' alt="product img" /></td>
                                    <td>{product.title}</td>
                                    <td>{product.price}</td>
                                    <td><span className='bg-yellow-300/50 p-2 px-4 rounded-full'>{product.verificationStatus}</span></td>
                                    <td>{product.category}</td>
                                    <td className='wrap-break-word pr-4' onClick={() => setSelectedProduct(product)}><span className='bg-green-700 p-2 md:px-4 rounded-full hover:bg-green-900 transition-all duration-300 cursor-pointer'>Check Details</span></td>
                                </tr>
                            }
                        })}



                    </tbody>
                </table>
            </div>

            {selectedProduct && <div className='w-full h-full bg-gray-600/60 absolute top-0 left-0 z-10 flex justify-center items-center'>
                <div className='bg-black w-[60%] rounded-2xl text-white p-8 flex flex-col gap-5 text-lg relative'>
                    <h1 className='text-2xl'>Product Details</h1>
                    <div className='flex gap-10 pr-10 text-center'>
                        <img src={selectedProduct.image[0]} alt="product image" className='h-20 border-2' />
                        <div className='w-full'>
                            <p className='text-xl font-semibold'>Title</p>
                            <p className='text-green-600'>{selectedProduct.title}</p>
                        </div>
                    </div>
                    <div className='flex justify-around'>
                        <div>
                            <p className='text-xl font-semibold'>Price</p>
                            <p className='text-green-600'>{selectedProduct.price}</p>
                        </div>
                        <div>
                            <p className='text-xl font-semibold'>Status</p>
                            <p className='text-green-600'>{selectedProduct.verificationStatus}</p>
                        </div>
                        <div>
                            <p className='text-xl font-semibold'>Category</p>
                            <p className='text-green-600'>{selectedProduct.category}</p>
                        </div>
                    </div>
                    <p><span className='text-xl'>Description:</span> <br /> <span className=' text-green-600'>{selectedProduct.description}</span></p>
                    <div className='flex justify-around'>
                        <button className='bg-blue-500 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition' onClick={() => getShopDetails(selectedProduct.vendor)}>Shop Details</button>
                        <button className='bg-gray-200 p-2 w-32 rounded-4xl hover:scale-110 active:scale-90 cursor-pointer transition text-black' onClick={() => setSelectedProduct('')}>Cancel</button>
                    </div>


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

export default ApprovedProduct
