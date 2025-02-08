/* eslint-disable no-unused-vars */
import React from 'react'

const ChoosePaymentPage = () => {
  return (
    <div className='w-full h-full flex justify-evenly items-center font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
        <button className='w-[25%] flex flex-col justify-center items-center gap-10 bg-blue-500 p-10 rounded-xl hover:scale-[110%] duration-500 cursor-pointer'>
            <h2 className='text-[34px] text-light text-center font-bold mb-10 select-none'>PayPal</h2>
        </button>
  </div>
  )
}

export default ChoosePaymentPage