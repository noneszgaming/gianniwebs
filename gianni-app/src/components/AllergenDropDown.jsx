/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from "react-icons/io";
import AllergenDropDownItem from './AllergenDropDownItem';
import { createPortal } from 'react-dom';

const AllergenDropDown = ({ className, initialSelectedAllergenes = {}, onAllergenChange, itemId }) => {
    const { t, i18n } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [allergenes, setAllergenes] = useState([]);
    const [selectedAllergenes, setSelectedAllergenes] = useState(initialSelectedAllergenes);
    const dropdownTriggerRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

    const fetchAllergenes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/specialtypes`);
            const data = await response.json();
            setAllergenes(data);
            
            // Only initialize if no initial value
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

    useEffect(() => {
        // Notify parent component if allergenes change
        if (onAllergenChange && JSON.stringify(selectedAllergenes) !== JSON.stringify(initialSelectedAllergenes)) {
            onAllergenChange(selectedAllergenes);
        }
    }, [selectedAllergenes, onAllergenChange, initialSelectedAllergenes]);

    // Update dropdown position when it opens
    useEffect(() => {
        if (isDropdownOpen && dropdownTriggerRef.current) {
            const rect = dropdownTriggerRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isDropdownOpen]);

    // Close dropdown on outside click or scroll
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen &&
                dropdownTriggerRef.current &&
                !dropdownTriggerRef.current.contains(event.target) &&
                !event.target.closest('.allergen-dropdown-menu')) {
                setIsDropdownOpen(false);
            }
        };
        
        // Close dropdown on scroll
        const handleScroll = () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true); // true for capture phase
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isDropdownOpen]);

    const selectedAllergensCount = Object.values(selectedAllergenes).filter(Boolean).length;

    return (
        <div className={`relative select-none ${className}`}>
            <div
                ref={dropdownTriggerRef}
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

            {isDropdownOpen && createPortal(
                <div
                    className='fixed allergen-dropdown-menu bg-white border border-accent rounded-lg p-2'
                    style={{
                        zIndex: 9999,
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                        maxHeight: '200px',
                        overflowY: 'auto'
                    }}
                >
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
                </div>,
                document.body
            )}
        </div>
    );
};

export default AllergenDropDown;
