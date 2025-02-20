/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import AddMerchToCartBtn from '../buttons/AddMerchToCartBtn';
import AmountCounter from '../AmountCounter';

import { cartCount } from '../../signals';

const MerchWidgetItem = ({ name, price, img, id }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1);


    // Inside handleAddToCart function, after localStorage update:
    const handleAddToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = existingCart.findIndex(item => item.name === name);
        
        if (existingItemIndex !== -1) {
            existingCart[existingItemIndex].quantity += selectedQuantity;
        } else {
            const newItem = {
                _id: id,
                name,
                description: "Merch item",
                price: parseInt(price),
                img,
                quantity: parseInt(selectedQuantity)
            };
            existingCart.push(newItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
        // Update cart count based on all items in cart
        cartCount.value = existingCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className='w-full h-fit flex flex-col justify-start items-center gap-4 bg-light font-poppins rounded-[26px] px-4 py-4 mb-10'>
            <img
                className='aspect-square w-[50%] lg:min-w-[50%] max-w-[300px] object-cover rounded-[26px] bg-amber-200'
                src={img}
                alt=""
            />
            <div className='h-full w-full flex flex-col justify-center items-start gap-3'>
                <h2 className='text-xl font-bold text-center'>
                    {name}
                </h2>
                <AmountCounter onQuantityChange={setSelectedQuantity} />
                <div className='w-full flex justify-between items-center gap-2'>
                    <p className='text-[20px] font-semibold'>{price} Ft</p>
                    <AddMerchToCartBtn onClick={handleAddToCart} />
                </div>
            </div>
        </div>
    )
}

export default MerchWidgetItem;