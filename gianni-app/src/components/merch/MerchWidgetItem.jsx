/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react'
import AddMerchToCartBtn from '../buttons/AddMerchToCartBtn';
import AmountCounter from '../AmountCounter';

import { cartCount } from '../../signals';
import { LanguageContext } from '../../context/LanguageContext';

const MerchWidgetItem = ({ name, price, img, id }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const { language } = useContext(LanguageContext);

    const handleAddToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = existingCart.findIndex(item => item.id === id);
        
        if (existingItemIndex !== -1) {
            existingCart[existingItemIndex].quantity += selectedQuantity;
        } else {
            const newItem = {
                id,
                name: {
                    hu: name.hu,
                    en: name.en,
                    de: name.de
                },
                description: {
                    hu: "Merch termék",
                    en: "Merch item",
                    de: "Merch Artikel"
                },
                price: parseInt(price),
                img,
                quantity: parseInt(selectedQuantity)
            };
            existingCart.push(newItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
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
                    {name[language]}
                </h2>
                <AmountCounter onQuantityChange={setSelectedQuantity} />
                <div className='w-full flex justify-between items-center gap-2'>
                    <p className='text-[20px] font-semibold'>{price} Ft</p>
                    <AddMerchToCartBtn onClick={handleAddToCart} />
                </div>
            </div>
        </div>
    );
};

export default MerchWidgetItem;