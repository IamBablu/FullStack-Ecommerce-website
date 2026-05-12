import React from 'react'

const Button = ({text = 'next', bgColor, onClick, disable = false, type = 'button'}) => {
  return (
    <div>
        <button onClick={onClick}
        type={type}
        disabled={disable}
        className={`${bgColor} cursor-pointer text-2xl min-w-[200px] h-[40px] rounded-full flex items-center justify-center gap-1 hover:shadow-md shadow-blue-900 hover:border-2 hover:border-white`}>
            {text}
        </button>
      
    </div>
  )
}

export default Button
