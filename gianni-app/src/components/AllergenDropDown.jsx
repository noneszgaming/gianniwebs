/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from "react-icons/io";
import AllergenDropDownItem from './AllergenDropDownItem';

const AllergenDropDown = ({ className, initialSelectedAllergenes = {}, onAllergenChange, itemId }) => {
    const { t, i18n } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [allergenes, setAllergenes] = useState([]);
    const [selectedAllergenes, setSelectedAllergenes] = useState(initialSelectedAllergenes);

    const fetchAllergenes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/specialtypes`);
            const data = await response.json();
            setAllergenes(data);
            
            // Csak akkor inicializáljuk, ha nincs kezdeti érték
            if (Object.keys(initialSelectedAllergenes).length === 0) {
                const initialSelected = {};
                data.forEach(allergene => {
                    initialSelected[allergene._id] = false;
                });
                setSelectedAllergenes(initialSelected);
            }
        } catch (error) {
            console.error('Error fetching allergenes:', error);
        }
    };

    useEffect(() => {
        fetchAllergenes();
    }, []);

    // Módosítsd az AllergenDropDown.jsx useEffect hook-ját
    useEffect(() => {
        // Ha változnak a kiválasztott allergének, értesítjük a szülő komponenst
        if (onAllergenChange && JSON.stringify(selectedAllergenes) !== JSON.stringify(initialSelectedAllergenes)) {
            onAllergenChange(selectedAllergenes);
        }
        // Függőségi tömb hozzáadása
    }, [selectedAllergenes, onAllergenChange, JSON.stringify(initialSelectedAllergenes)]);


    const selectedAllergensCount = Object.values(selectedAllergenes).filter(Boolean).length;

    return (
        <div className={`relative select-none ${className}`}>
            <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-full p-2 border border-accent rounded-lg flex justify-between items-center gap-2 cursor-pointer'
            >
                <span>
                    {selectedAllergensCount
                        ? `${t("allergens.title")} (${selectedAllergensCount})`
                        : t("allergens.title")}
                </span>
                <IoIosArrowDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
                <div className='absolute top-full left-0 w-fit bg-white border border-accent rounded-lg mt-1 p-2 z-10'>
                    {allergenes.map((allergene) => (
                        <AllergenDropDownItem
                            key={allergene.id}
                            allergenKey={allergene.id}
                            name={allergene.name[i18n.language]}
                            isChecked={Boolean(selectedAllergenes[allergene.id])}
                            onCheckChange={(newValue) => {
                                const newSelected = {
                                    ...selectedAllergenes,
                                    [allergene.id]: newValue
                                };
                                setSelectedAllergenes(newSelected);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllergenDropDown;
