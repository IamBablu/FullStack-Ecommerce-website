import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/image1.jpg'
import { userDataContext } from '../../context/UserContext'

const Products = () => {
  const {serverUrl, userdata, setUserData, products, setProducts} = useContext(userDataContext)
  const navigate = useNavigate()
  return (
    <div className='bg-blue-300 w-full h-full py-4 flex flex-col items-center gap-3'>
      <div className='bg-gray-950/60 flex justify-between px-20 items-center w-[90%] h-18 rounded-full'>
        <h1 className='text-4xl font-semibold'>Product Details</h1>
        <button className='bg-blue-600 p-2 px-6 rounded-full hover:scale-110 active:scale-90 cursor-pointer transition-all duration-300 text-xl font-semibold' onClick={()=>navigate('/add-product')}>+ Add Product</button>
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
            {products?.map((product, index)=> {
            return <tr key={index} className='border-t-2 text-center'>
              <td className='pl-4 py-1'><img src={product.image[0]} className='h-20 w-20 rounded-lg object-cover' alt="" /></td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td><span className='bg-yellow-300/50 p-2 px-4 rounded-full'>{product.verificationStatus}</span></td>
              <td className='text-red-500'>{product.isActive}</td>
              <td>
                <button className='block bg-green-500 w-[80%] mt-1 rounded-full hover:scale-110 active:scale-90 cursor-pointer transition ml-10'>Edit</button>
                <button disabled={product.verificationStatus !== "Approved"} className={`block w-[80%] mt-1 rounded-full ${product.verificationStatus == "Approved"? "bg-green-500 hover:scale-110 active:scale-90 cursor-pointer": 'bg-gray-600 cursor-not-allowed'}  transition ml-10`}>Enable</button>
                {product.verificationStatus == 'Rejected' && <div className='bg-red-400 rounded-lg my-1'>
                  <p>Rejected: {product.rejectedReason}</p>
                  <p>After edit, product will be sent for re-verification.</p>
                </div>}
              </td>
            </tr>
            })}
            <tr className='border-t-2 text-center'>
              <td className='pl-4 py-1'><img src={logo} className='h-20 w-20 rounded-lg object-cover' alt="" /></td>
              <td>new shoes className='text-center'</td>
              <td>199</td>
              <td><span className='bg-yellow-300/50 p-2 px-4 rounded-full'>pending</span></td>
              <td className='text-red-500'>in active</td>
              <td>
                <button className='block bg-green-500 w-[80%] mt-1 rounded-full hover:scale-110 active:scale-90 cursor-pointer transition ml-10'>Edit</button>
                <button className='block bg-green-500 w-[80%] mt-1 rounded-full hover:scale-110 active:scale-90 cursor-pointer transition ml-10'>Enable</button>
                <div className='bg-red-400 rounded-lg my-1'>
                  <p>Rejected: Reason</p>
                  <p>After edit, product will be sent for re-verification.</p>
                </div>
              </td>
            </tr>
            <tr className='border-t-2 text-center'>
              <td className='pl-4 py-1'><img src={logo} className='h-20 w-20 rounded-lg object-cover' alt="" /></td>
              <td>new shoes className='text-center'</td>
              <td>199</td>
              <td><span className='bg-yellow-300/50 p-2 px-4 rounded-full'>pending</span></td>
              <td className='text-red-500'>in active</td>
              <td>
                <button className='block bg-green-500 w-[80%] mt-1 rounded-full hover:scale-110 active:scale-90 cursor-pointer transition ml-10'>Edit</button>
                <button className='block bg-green-500 w-[80%] mt-1 rounded-full hover:scale-110 active:scale-90 cursor-pointer transition ml-10'>Enable</button>
                <div className='bg-red-400 rounded-lg my-1'>
                  <p>Rejected: Reason</p>
                  <p>After edit, product will be sent for re-verification.</p>
                </div>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Products
