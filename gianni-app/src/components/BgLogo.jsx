/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const BgLogo = () => {
  return (
    <div className='w-full relative'>
        <img 
            className='absolute w-[40%] left-1/2 top-[20px] transform -translate-x-1/2'
            src='/brown_mini_logo.png' 
            alt="Logo" 
        />
    </div>
  )
}

export default BgLogo