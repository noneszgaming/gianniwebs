/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const BoxCardItem = ({ name }) => {
  return (
    <div className='w-full h-fit flex justify-start items-center gap-2'>
        <span className='w-2 h-2 bg-amber-300 rounded-full flex flex-col gap-2'/>
        <p className='text-sm'>{name}</p>
    </div>
  )
}

export default BoxCardItem