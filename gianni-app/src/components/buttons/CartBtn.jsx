/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSignals } from '@preact/signals-react/runtime';
import React from 'react';
import { IoCartOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const CartBtn = ({ itemCount, className, route }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(route);
  };

  return (
    <button 
      className={`relative w-10 h-10 justify-center items-center bg-accent hover:bg-dark-accent duration-500 rounded-[8px] cursor-pointer overflow-visible select-none ${className}`}
      onClick={handleClick}
    >
      {itemCount > 0 &&
        <div 
          className='absolute -left-[90%] w-fit min-w-10 h-8 bg-light-accent rounded-l-[6px] flex justify-center items-center text-xs text-light' 
          style={{ zIndex: -1 }}
        >
          <p className='text-light text-[18px]'>{itemCount}</p>
        </div>
      }
      <IoCartOutline className='w-[24px] h-[24px] text-light'/>
    </button>
  )
}
export default CartBtn



