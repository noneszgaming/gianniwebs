/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import CartBtn from './buttons/CartBtn'
import HomeBtn from './buttons/HomeBtn'
import { useLocation } from 'react-router-dom'

const NavBar = ({ type }) => {

  const location = useLocation();

  return (
    <div 
      className='w-full min-h-16 h-16 flex justify-end items-center font-poppins px-3 bg-transparent'
      style={{ zIndex: -1 }}
    >
      <div className='flex gap-x-18'>
        {location.pathname !== '/' && <HomeBtn />}
        <CartBtn itemCount={4}/>
      </div>
    </div>
  )
}

export default NavBar

