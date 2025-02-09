/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import CartBtn from './buttons/CartBtn'
import HomeBtn from './buttons/HomeBtn'
import { useLocation } from 'react-router-dom'

const NavBar = ({ type }) => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleStorageChange = () => {
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(currentCart.length);
    };

    // Initial count
    handleStorageChange();

    // Listen for our custom event
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
        window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  //TODO: fix the cart count doesnt counts amount

  return (
    <div
      className='w-full min-h-16 h-16 flex justify-end items-center font-poppins px-3 bg-transparent'
      style={{ zIndex: -1 }}
    >
      <div className='flex gap-x-18'>
        {location.pathname !== '/' && <HomeBtn />}
        <CartBtn itemCount={cartCount}/>
      </div>
    </div>
  )
}

export default NavBar


