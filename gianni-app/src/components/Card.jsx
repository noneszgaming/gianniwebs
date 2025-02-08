/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import PrimaryBtn from './buttons/PrimaryBtn'
import AmountCounter from './AmountCounter';

const Card = ({ name, description, price, img }) => {

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value.length > 3) {
          value = value.slice(0, 3);
        }
        value = Math.min(Math.max(parseInt(value) || 0, 0), 100);
        e.target.value = value;
      }

      const handleKeyDown = (e) => {
        if (e.key === '-' || e.key === '.' || e.key === 'e') {
          e.preventDefault();
        }
      }

  return (
    <div className='hover:scale-[110%] w-[300px] h-[520px] flex flex-col items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 overflow-hidden'>
        <img 
            className='w-full h-[60%] object-cover rounded-[26px] bg-amber-200'
            src="" 
            alt="" 
        />
        <div className='w-[90%] h-[40%] flex flex-col justify-center items-start'>
            <h2 className='text-2xl font-bold text-center'>
                {name}
            </h2>
            <p className='text-sm'>
                {description}
            </p>
            <div className='flex justify-between items-center w-full py-3'>
                <p className='text-[22px] font-bold'>{price} Ft</p>
                <AmountCounter />
            </div>
            <PrimaryBtn text="Add to Cart" className='w-[80%] text-lg self-center' />
        </div>
    </div>
  )
}

export default Card