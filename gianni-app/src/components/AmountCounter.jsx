/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const AmountCounter = ({ className }) => {

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value.length > 3) {
          value = value.slice(0, 3);
        }
        value = Math.min(Math.max(parseInt(value) || 0, 0), 100);
        e.target.value = value;
      }

      const handleKeyDown = (e) => {
        if (e.key === '-' || e.key === '.' || e.key === 'e') {
          e.preventDefault();
        }
      }

  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
        <p className='font-semibold text-[16px]'>Amount</p>
        <input 
            className='w-[60px] h-[30px] text-center focus:text-accent focus:caret-accent bg-zinc-200 rounded-lg outline-none'
            type="number" 
            min="1"
            max="100"
            defaultValue={1}
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
        />
    </div>
  )
}

export default AmountCounter