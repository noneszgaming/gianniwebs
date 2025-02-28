/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';

const AmountCounter = ({ className, type, name, id, onQuantityChange }) => {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);
    
    // Initialize quantity from localStorage when component mounts
    useEffect(() => {
        if (type === "cartItem") {
            const storedQuantity = getQuantityFromStorage();
            setQuantity(storedQuantity);
        }
    }, [type, id]);

    const getQuantityFromStorage = () => {
        if (type === "cartItem") {
            const isAirbnb = window.location.pathname.includes('/airbnb');
            const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
            
            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
            const item = cart.find(item => item.id === id);
            return item ? item.quantity : 1;
        }
        return 1;
    }

    const handleInputChange = (e) => {
        let value = e.target.value;
        if (value.length > 3) {
            value = value.slice(0, 3);
        }
        
        // Ensure value is a valid number between 0-100
        const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 100);
        
        // Update local state
        setQuantity(numValue);

        if (type === "cartItem") {
            const isAirbnb = window.location.pathname.includes('/airbnb');
            const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
            
            const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
            const itemIndex = cart.findIndex(item => item.id === id);
            
            if (itemIndex !== -1) {
                cart[itemIndex].quantity = numValue;
                localStorage.setItem(cartKey, JSON.stringify(cart));
                window.dispatchEvent(new Event('cartUpdated'));
            }
        }

        if (onQuantityChange) {
            onQuantityChange(numValue);
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
                value={quantity}
                onKeyDown={handleKeyDown}
                onChange={handleInputChange}
            />
        </div>
    )
}

export default AmountCounter
