/* eslint-disable no-unused-vars */
import React from 'react'
import CartItem from '../components/CartItem';
import TotalSummaryWidget from '../components/TotalSummaryWidget';
import MerchWidget from '../components/merch/MerchWidget';

const CartPage = () => {
  return (
    <div className='w-full h-fit grid grid-cols-3 md:grid-cols-4 justify-items-center gap-x-10 font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
    <div className="w-full col-span-3">
      <CartItem name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="3000" img="" />
      <CartItem name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing" price="2700" img="" />
      <CartItem name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="2500" img="" />
      <CartItem name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="2900" img="" />
      <CartItem name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="3000" img="" />
      <CartItem name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="3000" img="" />
    </div>
    <div className="w-full flex flex-col gap-10">
      <TotalSummaryWidget totalPrice="12000" />
      <MerchWidget />
    </div>
  </div>
  )
}

export default CartPage