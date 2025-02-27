/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useTranslation } from 'react-i18next';

const AmountCounter = ({ className, type, name, onQuantityChange }) => {
    const { t } = useTranslation();
  
    const getQuantityFromStorage = () => {
        if (type === "cartItem") {
            const isAirbnb = window.location.pathname.includes('/airbnb');
            const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
            
            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
            const item = cart.find(item => 
                (item.name?.en || item.name) === name
            );
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

        if (type === "cartItem") {
            const isAirbnb = window.location.pathname.includes('/airbnb');
            const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
            
            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
            const itemIndex = cart.findIndex(item => 
                (item.name?.en || item.name) === name
            );
            
            if (itemIndex !== -1) {
                cart[itemIndex].quantity = parseInt(value);
                localStorage.setItem(cartKey, JSON.stringify(cart));
                window.dispatchEvent(new Event('cartUpdated'));
            }
        }

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
            <p className='font-semibold text-[16px]'>{t('amount')}</p>
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



