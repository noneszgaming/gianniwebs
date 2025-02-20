/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import PrimaryBtn from './buttons/PrimaryBtn'
import AmountCounter from './AmountCounter';

import { useTranslation } from 'react-i18next';
import { cartCount } from '../signals';


const Card = ({ name, description, price, img, id }) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

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
                    hu: description.hu,
                    en: description.en,
                    de: description.de
                },
                price,
                img,
                quantity: selectedQuantity
            };
            existingCart.push(newItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
        cartCount.value = existingCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className='hover:scale-[110%] w-[300px] h-[520px] flex flex-col items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 overflow-hidden'>
            <img 
                className='w-full h-[60%] object-cover rounded-[26px] bg-amber-200'
                src={img} 
                alt="" 
            />
            <div className='w-[90%] h-[40%] flex flex-col justify-center items-start'>
                <h2 className='text-2xl font-bold text-center'>
                    {name[language]}
                </h2>
                <p className='text-sm'>
                    {description[language]}
                </p>
                <div className='flex justify-between items-center w-full py-3'>
                    <p className='text-[22px] font-bold'>{price} Ft</p>
                    <AmountCounter onQuantityChange={setSelectedQuantity} />
                </div>
                <PrimaryBtn 
                    text={t("primaryBtn.addToCart")} 
                    className='w-[80%] text-lg self-center'
                    onClick={handleAddToCart}
                />
            </div>
        </div>
    )
}
export default Card

