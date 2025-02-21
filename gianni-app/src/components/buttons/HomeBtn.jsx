/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const HomeBtn = ({ className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <button 
      className={`relative w-10 h-10 justify-center items-center bg-accent hover:bg-amber-800 duration-500 rounded-[8px] cursor-pointer overflow-visible ${className}`}
      onClick={handleClick}
    >
      <IoHomeOutline className='w-[24px] h-[24px] text-light'/>
    </button>
  )
}

export default HomeBtn