/* eslint-disable no-unused-vars */
import { useSignals } from '@preact/signals-react/runtime';
import React from 'react'
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { isSidePanelOpened } from '../../signals';

const SidePanelBtn = () => {
  useSignals();

  const handleClick = () => {
    isSidePanelOpened.value = !isSidePanelOpened.value;
  };

  return (
    <button 
      className='relative w-10 h-10 flex md:hidden justify-center items-center bg-accent hover:bg-red-600 duration-500 rounded-[8px] cursor-pointer overflow-visible'
      style={{ zIndex: 3000 }}
      onClick={handleClick}
    >
      <HiOutlineMenuAlt3 className='w-[24px] h-[24px] text-light'/>
    </button>
  )
}

export default SidePanelBtn