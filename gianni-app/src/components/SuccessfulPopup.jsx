/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useSignals } from '@preact/signals-react/runtime'
import PrimaryBtn from './buttons/PrimaryBtn';
import { useNavigate } from 'react-router-dom';
import { isSuccessfulPaymentOpened } from '../signals';

const SuccessfulPopup = ({ title, text}) => {

 const navigate = useNavigate();

  return (
    <div className='absolute w-full h-full flex flex-col justify-center items-center font-poppins bg-black/70 backdrop-blur-lg' style={{ zIndex: 2 }}>
        <div className='w-[70%] h-[70%] flex flex-col justify-center items-center gap-12 bg-slate-200 rounded-3xl select-none'>
            <h2 className='font-semibold text-[40px] text-accent'>Successfull {title}</h2>
            <p className='font-medium text-xl'>{text}</p>
            <PrimaryBtn text="OK" onClick={() => isSuccessfulPaymentOpened.value = false} />
        </div>
    </div>
  )
}

export default SuccessfulPopup