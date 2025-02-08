/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const SecondaryBtn = ({text, onClick, className}) => {
  return (
    <button 
        className={`bg-primary hover:bg-red-500 bg-red-400 dark:hover:bg-secondary text-light font-poppins font-semibold text-[20px] md:text-xl py-3 px-4 rounded-[20px] transition-all select-none duration-500 cursor-pointer hover:shadow-[0_0_48px_rgba(240,43,43,0.8)] ${className}`}
        onClick={() => onClick()}
    >
        {text}
    </button>
  )
}

export default SecondaryBtn