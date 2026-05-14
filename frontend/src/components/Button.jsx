import React from 'react'

const Button = ({text = 'next', bgColor, onClick, disable = false, type = 'button'}) => {
  return (
    <div>
        <button onClick={onClick}
        type={type}
        disabled={disable}
        className={`cursor-pointer text-2xl h-[40px] rounded-full flex items-center justify-center gap-1 hover:shadow-md shadow-blue-900 hover:border-2 hover:border-white ${bgColor}`}>
            {text}
        </button>
      
    </div>
  )
}

export default Button
