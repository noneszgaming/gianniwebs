/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FaCheck } from "react-icons/fa6";

const CheckBox = ({ isChecked, setIsChecked}) => {

  return (
    <div 
        onClick={() => {
          setIsChecked(!isChecked); 
        }}
        className='w-6 min-w-6 aspect-square flex justify-center items-center border-accent border-[1px] rounded-[8px] hover:cursor-pointer'
    >
        {isChecked && <FaCheck className='w-5 h-5 text-accent'/>}
    </div>
  )
}

export default CheckBox