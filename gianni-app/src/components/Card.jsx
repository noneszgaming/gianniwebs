/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import PrimaryBtn from './buttons/PrimaryBtn'
import AmountCounter from './AmountCounter';
import CheckBox from './CheckBox'
import { useTranslation } from 'react-i18next';
import { cartCount } from '../signals';
import { IoIosArrowDown } from "react-icons/io";


const Card = ({ name, description, price, img, id }) => {
    const { t } = useTranslation();
    const { language } = useContext(LanguageContext);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [allergens, setAllergens] = useState({
        gluten: false,
        lactose: false,
        nuts: false,
        eggs: false,
    });

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
                quantity: selectedQuantity,
                allergens: Object.entries(allergens)
                .filter(([_, value]) => value)
                .map(([key]) => key)
            };
            existingCart.push(newItem);
        }
        
        localStorage.setItem('cart', JSON.stringify(existingCart));
        cartCount.value = existingCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const selectedAllergensCount = Object.values(allergens).filter(Boolean).length;

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

                <div className='w-full mb-4 relative select-none'>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className='w-full p-2 border border-accent rounded-lg flex justify-between items-center cursor-pointer'
                    >
                        <span>
                            {selectedAllergensCount 
                                ? `${t("allergens.title")} (${selectedAllergensCount})` 
                                : t("allergens.title")}
                        </span>
                        <IoIosArrowDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {isDropdownOpen && (
                        <div className='absolute top-full left-0 w-full bg-white border border-accent rounded-lg mt-1 p-2 z-10'>
                            {Object.entries(allergens).map(([key, value]) => (
                                <div key={key} className='flex items-center gap-2 py-1'>
                                    <CheckBox
                                        isChecked={value}
                                        setIsChecked={(newValue) => setAllergens(prev => ({...prev, [key]: newValue}))}
                                    />
                                    <span>{t(`allergens.${key}`)}</span>
                                </div>
                            ))}
                        </div>
                    )}
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

