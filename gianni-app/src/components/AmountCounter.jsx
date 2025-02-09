/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const AmountCounter = ({ className, type, name, onQuantityChange }) => {
    const getQuantityFromStorage = () => {
        if (type === "cartItem") {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.name === name);
            return item ? item.quantity : 1;
        }
        return 1;
    }

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        value = Math.min(Math.max(parseInt(value) || 0, 0), 100);
        e.target.value = value;
        if (onQuantityChange) {
            onQuantityChange(value);
        }
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
                value={type === "cartItem" ? getQuantityFromStorage() : undefined}
                defaultValue={type === "cartItem" ? undefined : 1}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
            />
        </div>
    )
}

export default AmountCounter


