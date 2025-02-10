/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import CartBtn from './buttons/CartBtn'
import HomeBtn from './buttons/HomeBtn'
import { useLocation } from 'react-router-dom'
import { useSignals } from '@preact/signals-react/runtime'
import { isWebshopOpen } from '../signals'

const NavBar = ({ type }) => {

  useSignals();

  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalQuantity = currentCart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalQuantity);
    };

    handleStorageChange();
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
        window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  return (
    <div
      className='w-full min-h-16 h-16 flex justify-between items-center font-poppins px-3 bg-slate-50 rounded-b-2xl select-none'
      style={{ zIndex: -1 }}
    >
      <div className='flex gap-x-6'>
        <p className='font-semibold text-neon-green'>ADMIN</p>
      </div>

      <div className='flex gap-x-18'>
        <div className='flex justify-center items-center font-semibold text-lg text-neon-green gap-2 select-none'>
          <p className={`${isWebshopOpen.value ? "text-neon-green" : "text-red-600"}`}>{isWebshopOpen.value ? "OPEN" : "CLOSED"}</p>
          <span className={`w-[6px] aspect-square rounded-full relative z-10 ${
            isWebshopOpen.value 
              ? "bg-neon-green shadow-[0_0_5px_rgba(32,204,0,1),0_0_10px_rgba(32,204,0,1),0_0_15px_rgba(32,204,0,1),0_0_20px_rgba(32,204,0,1),0_0_25px_rgba(32,204,0,1)] transition-all animate-pulse" 
              : "bg-red-600 shadow-[0_0_5px_rgba(240,43,43,1),0_0_10px_rgba(240,43,43,1),0_0_15px_rgba(240,43,43,1),0_0_20px_rgba(240,43,43,1),0_0_25px_rgba(240,43,43,1)] transition-all animate-pulse"
          }`} />
        </div>
        {location.pathname !== '/' && <HomeBtn />}
        <CartBtn itemCount={cartCount} />
      </div>
    </div>
  )
}

export default NavBar


