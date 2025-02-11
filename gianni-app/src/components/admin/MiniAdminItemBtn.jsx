/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Children } from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const MiniAdminItemBtn = ({ children, onClick }) => {

  return (
    <button 
      className='relative w-10 h-10 flex justify-center items-center bg-accent hover:bg-red-600 duration-500 rounded-[8px] cursor-pointer overflow-visible'
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default MiniAdminItemBtn