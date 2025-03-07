/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from "react-icons/io";
import FoodDropDownItem from './FoodDropDownItem';
import { airbnbStoreOpen, publicStoreOpen } from '../../signals';
import toast from 'react-hot-toast';
import { useSignals } from '@preact/signals-react/runtime';

const FoodDropDown = ({ onFoodsSelected, initialSelectedIds = [] }) => {

    useSignals();

    const { t, i18n } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFoodItems, setSelectedFoodItems] = useState({});
    const [foods, setFoods] = useState([]);
    const initialProcessingDone = useRef(false);
    const prevSelectedItemsRef = useRef(null);

    // Fetch foods only once
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const availableFoods = data
                        .filter(item => item.type === 'food' && item.available)
                        .map(food => ({
                            ...food,
                            uniqueId: food._id
                        }));
                    
                    setFoods(availableFoods);
                } else {
                    setFoods([]);
                }
            } catch (error) {
                console.error('Error fetching foods:', error);
                setFoods([]);
            }
        };
        
        fetchFoods();
    }, []);

    // Process initial selected IDs when foods are loaded - only once
    useEffect(() => {
        if (foods.length > 0 && !initialProcessingDone.current) {
            // Set default value: all items false
            const newState = {};
            foods.forEach(food => {
                newState[food._id] = false;
            });
            
            // Set selected items to true
            if (initialSelectedIds && initialSelectedIds.length > 0) {
                initialSelectedIds.forEach(selectedId => {
                    foods.forEach(food => {
                        const foodId = String(food._id);
                        const selectedIdStr = String(selectedId);
                        
                        if (foodId === selectedIdStr ||
                            String(food.id) === selectedIdStr ||
                            String(food.uniqueId) === selectedIdStr) {
                            newState[food._id] = true;
                        }
                    });
                });
            }
            
            setSelectedFoodItems(newState);
            initialProcessingDone.current = true;
        }
    }, [foods, initialSelectedIds]);

    // Notify parent of selections - but use ref to prevent infinite loop
    useEffect(() => {
        if (!initialProcessingDone.current) return;
        
        const selectedIds = Object.entries(selectedFoodItems)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id)
            .filter(id => id);
        
        // Only call onFoodsSelected if selected items have actually changed
        const currentSelectedJson = JSON.stringify(selectedIds.sort());
        if (prevSelectedItemsRef.current !== currentSelectedJson) {
            prevSelectedItemsRef.current = currentSelectedJson;
            
            if (onFoodsSelected) {
                onFoodsSelected(selectedIds);
            }
        }
    }, [selectedFoodItems, onFoodsSelected]);

    // Function to handle item selection changes
    const handleItemSelectionChange = (itemId, newValue) => {
        setSelectedFoodItems(prev => ({
            ...prev,
            [itemId]: newValue
        }));
    };

    // Calculate selected count
    const selectedFoodItemsCount = Object.values(selectedFoodItems).filter(Boolean).length;

    const openDropdownAttempt = () => {  
        if (shouldShowWarning()) {
            toast.error("Csak akkor módosítható, ha mindkét bolt zárva van!");
        } else {
            setIsDropdownOpen(!isDropdownOpen);
        }
    }

    const shouldShowWarning = () => {
        return airbnbStoreOpen.value || publicStoreOpen.value;
    };
    
    return (
        <div className='w-[80%] min-w-50 mb-4 relative select-none'>
            <div
                onClick={openDropdownAttempt}
                className={`w-full p-2 border border-accent rounded-lg flex justify-between items-center ${shouldShowWarning() ? 'text-slate-400 cursor-not-allowed' : 'text-dark cursor-pointer'}`}
            >
                <p>
                    {selectedFoodItemsCount
                        ? `Food Selected (${selectedFoodItemsCount})`
                        : 'Select Foods'
                    }
                </p>
                <IoIosArrowDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
                <div className='absolute top-full left-0 w-fit max-h-60 bg-white border border-accent rounded-lg mt-1 p-2 z-10 overflow-y-auto'>
                    {foods.length === 0 ? (
                        <div className="py-2 text-center text-gray-500">No food items available</div>
                    ) : (
                        foods.map((foodItem) => {
                            const itemId = foodItem._id;
                            return (
                                <FoodDropDownItem
                                    key={itemId}
                                    foodItemKey={itemId}
                                    name={foodItem.name[i18n.language] || foodItem.name.en}
                                    isChecked={Boolean(selectedFoodItems[itemId])}
                                    onCheckChange={(newValue) => handleItemSelectionChange(itemId, newValue)}
                                />
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(FoodDropDown);
