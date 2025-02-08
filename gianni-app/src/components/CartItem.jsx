/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import RemoveFromCartBtn from './buttons/RemoveFromCartBtn';
import AmountCounter from './AmountCounter';

const CartItem = ({ name, description, price, count, img }) => {

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
    <div className='w-full min-w-full h-48 flex justify-between items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl px-8 mb-10'>
        <div className='h-full flex justify-center items-center gap-4'>
            <img 
                className='aspect-square h-[80%] min-h-[80%] object-cover rounded-[26px] bg-amber-200'
                src="" 
                alt="" 
            />
            <div className='flex flex-col justify-center items-start'>
                <h2 className='text-2xl font-bold text-center'>
                    {name}
                </h2>
                <p className='text-md'>
                    {description}
                </p>
            </div>
        </div>

        <div className='flex justify-center items-center gap-7'>

            <RemoveFromCartBtn className={'self-end'} />

            <div className='flex flex-col justify-center items-end gap-3'>
                <p className='text-[22px] font-bold'>{price} Ft</p>
                <AmountCounter />
            </div>
        </div>

    </div>
  )
}

export default CartItem