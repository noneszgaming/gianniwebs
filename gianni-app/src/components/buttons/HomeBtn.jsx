/* eslint-disable no-unused-vars */
import React from 'react'
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const HomeBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <button 
      className='relative w-10 h-10 flex justify-center items-center bg-accent hover:bg-red-600 duration-500 rounded-[8px] cursor-pointer overflow-visible'
      onClick={handleClick}
    >
      <IoHomeOutline className='w-[24px] h-[24px] text-light'/>
    </button>
  )
}

export default HomeBtn