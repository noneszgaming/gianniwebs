/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useSignals } from '@preact/signals-react/runtime';
import React from 'react'
import { IoIosAdd } from "react-icons/io";
import { useTranslation } from 'react-i18next';

const AddMerchToCart = ({ onClick }) => {

    useSignals();

    const { t } = useTranslation();

  return (
    <button 
      className='relative fit h-10 flex justify-center items-center bg-accent hover:bg-dark-accent duration-500 rounded-[8px] cursor-pointer overflow-visible select-none'
      onClick={onClick}
    >
      <IoIosAdd className='w-8 h-8 text-light'/>
      <p className='text-light text-sm font-poppins font-semibold pr-2'>{t("primaryBtn.add")}</p>
    </button>
  )
}

export default AddMerchToCart