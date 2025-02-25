/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from "react-icons/io";
import AllergenDropDownItem from './AllergenDropDownItem';

const AllergenDropDown = ({ }) => {

        const { t } = useTranslation();
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);
        const [allergens, setAllergens] = useState({
            gluten: false,
            lactose: false,
            nuts: false,
            eggs: false,
        });

    const selectedAllergensCount = Object.values(allergens).filter(Boolean).length;

    return (
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
                        <AllergenDropDownItem
                            key={key}
                            allergenKey={key}
                            isChecked={value}
                            onCheckChange={(newValue) => setAllergens(prev => ({...prev, [key]: newValue}))}
                            t={t}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllergenDropDown;
