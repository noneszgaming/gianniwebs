/* eslint-disable no-empty-pattern */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import PrimaryBtn from '../buttons/PrimaryBtn'
import MerchWidgetItem from './MerchWidgetItem'

const MerchWidget = ({  }) => {
  return (
    <div className='w-full h-[550px] flex flex-col justify-start items-center bg-slate-600 font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 pt-8 gap-2'>
        <h2 className='text-2xl font-bold text-center text-light'>
            Merches
        </h2>

        <div className='w-full flex flex-col justify-start items-center px-4 overflow-auto mb-6'>
          <MerchWidgetItem name="Hoodie" price="7000"/>
          <MerchWidgetItem name="Keychain" price="2000"/>
          <MerchWidgetItem name="Hoodie" price="7000"/>
          <MerchWidgetItem name="Keychain" price="2000"/>
        </div>

    </div>
  )
}

export default MerchWidget