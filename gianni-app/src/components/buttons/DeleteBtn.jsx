/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { HiOutlineTrash } from "react-icons/hi2";

const DeleteBtn = ({ onClick, className }) => {

  return (
    <button 
      className={`relative w-10 h-10 flex justify-center items-center bg-red-300 hover:bg-red-500 duration-500 rounded-[8px] cursor-pointer overflow-visible ${className}`}
      onClick={onClick}
    >
      <HiOutlineTrash className='w-[24px] h-[24px] text-light'/>
    </button>
  )
}

export default DeleteBtn