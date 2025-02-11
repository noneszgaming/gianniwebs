/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

const NavBarBtn = ({ text, onClick }) => {
    const [isHovered, setIsHovered] = useState(false)
  return (
    <div className='flex flex-col justify-center items-center relative'>
        <button 
            className='w-fit h-fit flex justify-center items-center font-semibold text-lg text-black gap-2 select-none cursor-pointer relative'
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >   
            {text}
        </button>
        <span className={`absolute bottom-0 h-[3px] bg-accent duration-500 ${isHovered ? "w-full" : "w-[0px]"}`} />
    </div>
  )
}

export default NavBarBtn