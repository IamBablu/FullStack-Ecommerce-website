import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const UserProduct = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const product = location.state?.product;
    console.log(product)
  return (
    <div>
      UserProduct
    </div>
  )
}

export default UserProduct
