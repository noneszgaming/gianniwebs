/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import AddMerchToCartBtn from '../buttons/AddMerchToCartBtn';
import AmountCounter from '../AmountCounter';

const MerchWidgetItem = ({ name, price, img }) => {

  return (
    <div className='w-full min-w-full h-48 min-h-48 flex justify-start items-center gap-4 bg-light font-poppins rounded-[26px] px-4 mb-10'>

        <img 
            className='aspect-square h-[60%] min-h-[60%] object-cover rounded-[26px] bg-amber-200'
            src="" 
            alt="" 
        />

        <div className='h-full w-full flex flex-col justify-center items-start gap-3'>

            <h2 className='text-xl font-bold text-center'>
                {name}
            </h2>
        
            <AmountCounter />

            <div className='w-full flex justify-between items-center gap-2'>
                <p className='text-[20px] font-semibold'>{price} Ft</p>
                <AddMerchToCartBtn />
            </div>
        </div>

    </div>
  )
}

export default MerchWidgetItem