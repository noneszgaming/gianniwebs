/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import PrimaryBtn from './buttons/PrimaryBtn'
import AmountCounter from './AmountCounter';
import { useTranslation } from 'react-i18next';
import { cartCount } from '../signals';
import AllergenDropDown from './AllergenDropDown';

const Card = ({ name, description, price, img, id }) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedAllergenes, setSelectedAllergenes] = useState({});

    const handleAddToCart = () => {
        const existingCart = JSON.parse(localStorage.getItem('cart_public')) || [];
        const existingItemIndex = existingCart.findIndex(item => item.id === id);
       
        if (existingItemIndex !== -1) {
            existingCart[existingItemIndex].quantity += selectedQuantity;
            // Frissítsük az allergéneket is, ha szükséges
            existingCart[existingItemIndex].allergenes = selectedAllergenes;
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
                quantity: selectedQuantity,
                allergenes: selectedAllergenes, // Allergének mentése
            };
            existingCart.push(newItem);
        }
       
        localStorage.setItem('cart_public', JSON.stringify(existingCart));
        cartCount.value = existingCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className='hover:scale-[110%] w-[300px] h-[560px] flex flex-col gap-4 items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 overflow-y-visible'>
            <img
                className='w-full aspect-square object-cover rounded-[26px] bg-amber-200'
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

                <AllergenDropDown 
                    className="w-full"
                    onAllergenChange={(allergenes) => setSelectedAllergenes(allergenes)}
                />

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
