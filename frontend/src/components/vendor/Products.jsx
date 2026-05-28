import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/image1.jpg'
import { userDataContext } from '../../context/UserContext'
import axios from 'axios'

const Products = () => {
  const { serverUrl, userdata, setUserData, products, setProducts } = useContext(userDataContext)
  const navigate = useNavigate()
  const [activeProducts, setActiveProducts] = useState("Pending")

  const handleEnable = async (product) => {
    console.log(product, product.isActive)
    const result = await axios.patch(`${serverUrl}/product/active-product`, { isActive: !product.isActive, productId: product._id }, { withCredentials: true })
    setProducts(products.map((pro) => pro._id === result.data.data?._id ? result.data.data : pro))
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
    <div className='bg-blue-300 w-full h-full py-4 flex flex-col items-center'>
      <div className='bg-gray-950/60 flex justify-between px-20 items-center w-[90%] h-18 rounded-full'>
        <h1 className='text-4xl font-semibold'>Product Details</h1>
        <button className='bg-blue-600 p-2 px-6 rounded-full hover:scale-110 active:scale-90 cursor-pointer transition-all duration-300 text-xl font-semibold' onClick={() => navigate('/add-product')}>+ Add Product</button>
      </div>
      <div className='h-12 w-[90%] bg-gray-500 rounded-full flex justify-center gap-10'>
        <button className={`${activeProducts == "Pending"? "bg-gray-900": "bg-gray-700"} px-6 py-2 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer`} onClick={()=> setActiveProducts("Pending")}>Pending</button>
        <button className={`${activeProducts == "Approved"? "bg-gray-900": "bg-gray-700"} px-6 py-2 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer`} onClick={()=> setActiveProducts("Approved")}>Approved</button>
        <button className={`${activeProducts == "Rejected"? "bg-gray-900": "bg-gray-700"} px-6 py-2 rounded-full hover:scale-110 active:scale-90 transition cursor-pointer`} onClick={()=> setActiveProducts("Rejected")}>Rejected</button>
      </div>
      <div className='bg-gray-800 h-[85%] w-[90%] rounded-4xl overflow-y-scroll [&::-webkit-scrollbar]:w-0 px-10 py-4'>
        <table className='w-full table-fixed'>
          <thead className='bg-gray-500 text-2xl'>
            <tr >
              <th className='p-2 w-32'>Image</th>
              <th className='p-2 w-40'>Title</th>
              <th className='p-2 w-20'>Price</th>
              <th className='p-2 w-26'>Status</th>
              <th className='p-2 w-26'>Active</th>
              <th className='p-2'>Action</th>
            </tr>
          </thead>
          <tbody className='bg-gray-700'>
            {products?.map((product, index) => {
              if(activeProducts == product.verificationStatus ){
              return <tr key={index} className='border-t-2 text-center'>
                <td className='pl-4 py-1'><img src={product.image[0]} className='h-20 w-20 rounded-lg object-cover' alt="" /></td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td><span className={` p-2 px-4 rounded-full ${product.verificationStatus == "Approved" ? "bg-green-500/50" : product.verificationStatus == "Rejected" ? "bg-red-500/50" : "bg-yellow-300/50"}`}>{product.verificationStatus}</span></td>
                <td className='text-red-500'>{product.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button className='block bg-green-500 w-[80%] mt-1 rounded-full hover:scale-110 active:scale-90 cursor-pointer transition ml-10' onClick={() => navigate('/edit-product', { state: { product: product } })}>Edit</button>
                  <button disabled={product.verificationStatus !== "Approved"} className={`block w-[80%] mt-1 rounded-full ${product.verificationStatus == "Approved" ? "bg-green-500 hover:scale-110 active:scale-90 cursor-pointer" : 'bg-gray-600 cursor-not-allowed'}  transition ml-10`} onClick={() => handleEnable(product)}>{product.isActive ? 'Disable' : 'Enable'}</button>
                  {product.verificationStatus == 'Rejected' && <div className='bg-red-400 rounded-lg my-1'>
                    <p>Rejected: {product.rejectedReason}</p>
                    <p>After edit, product will be sent for re-verification.</p>
                  </div>}
                </td>
              </tr>
              }
            })}

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products
