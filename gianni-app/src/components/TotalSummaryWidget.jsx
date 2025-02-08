/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import PrimaryBtn from './buttons/PrimaryBtn'
import { useNavigate } from 'react-router-dom';

const TotalSummaryWidget = ({ totalPrice }) => {

    const navigate = useNavigate();

    const handleClick = () => {
      navigate('/order');
    };

  return (
    <div className='w-full h-[300px] flex flex-col justify-evenly items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 overflow-hidden px-4'>
        <h2 className='text-2xl font-bold text-center'>
            Total Summary
        </h2>

        <div className='w-[80%] flex justify-between items-center py-3'>
            <p className='text-lg'>
                Subtotal:
            </p>
            <p className='text-[30px] font-bold'>{totalPrice} Ft</p>
        </div>
        <PrimaryBtn 
            text="ORDER NOW" 
            className='w-[80%] text-xl'
            onClick={handleClick}
        />

    </div>
  )
}

export default TotalSummaryWidget