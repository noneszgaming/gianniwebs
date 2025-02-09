/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSignals } from '@preact/signals-react/runtime';
import React from 'react'
import { IoIosAdd } from "react-icons/io";

const AddMerchToCart = ({ onClick }) => {

    useSignals();

  return (
    <button 
      className='relative fit h-10 flex justify-center items-center bg-accent hover:bg-red-600 duration-500 rounded-[8px] cursor-pointer overflow-visible select-none'
      onClick={onClick}
    >
      <IoIosAdd className='w-[40px] h-[40px] text-light'/>
      <p className='text-light font-poppins font-semibold pr-2'>ADD</p>
    </button>
  )
}

export default AddMerchToCart