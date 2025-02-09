/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import AddMerchToCartBtn from '../buttons/AddMerchToCartBtn';
import AmountCounter from '../AmountCounter';

const MerchWidgetItem = ({ name, price, img, id }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1);

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
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className='w-full min-w-full h-48 min-h-48 flex justify-start items-center gap-4 bg-light font-poppins rounded-[26px] px-4 mb-10'>
            <img
                className='aspect-square h-[60%] min-h-[60%] object-cover rounded-[26px] bg-amber-200'
                src=""
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