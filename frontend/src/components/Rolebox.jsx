import React from 'react'

const Rolebox = ({text = 'user', img = 'hii', onClick, isSelected= false}) => {
  return (
    <div onClick={onClick}
    className={`cursor-pointer border-2 border-blue-950 rounded-2xl w-fit hover:shadow-xl shadow-blue-900 hover:border-2 hover:border-white ${isSelected? 'border-white shadow-xl': ""}`}>
            <img className='w-[100px] h-[100px] object-cover rounded-full' src={img}  />
            <p className='text-center text-2xl'>{text}</p>
    </div>
  )
}

export default Rolebox
