/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from "react-icons/io";
import FoodDropDownItem from './FoodDropDownItem';

// Add onFoodsSelected prop to pass data up to parent component
const FoodDropDown = ({ onFoodsSelected }) => {
    const { t, i18n } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFoodItems, setSelectedFoodItems] = useState({});
    const [foods, setFoods] = useState([]);  

    // Fetch foods from the API
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                console.log('Fetching foods...');
                const token = localStorage.getItem('adminToken');
                
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                console.log('Foods data:', data);
                
                if (Array.isArray(data)) {
                    // Filter for only food items that are available
                    const availableFoods = data
                        .filter(item => item.type === 'food' && item.available)
                        .map(food => ({
                            ...food,
                            uniqueId: food._id || `food-${Math.random().toString(36).substr(2, 9)}`
                        }));
                    
                    setFoods(availableFoods);
                    
                    // Initialize the selected state
                    const initialState = {};
                    availableFoods.forEach(food => {
                        initialState[food.uniqueId] = false;
                    });
                    setSelectedFoodItems(initialState);
                } else {
                    console.error('Invalid response format:', data);
                    setFoods([]);
                }
            } catch (error) {
                console.error('Error fetching foods:', error);
                setFoods([]);
            }
        };
        
        fetchFoods();
    }, []);

    // Update parent component whenever selection changes
    useEffect(() => {
        // Extract the IDs of selected food items
        const selectedIds = Object.entries(selectedFoodItems)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id);
        
        // Call the callback with selected IDs if provided
        if (onFoodsSelected) {
            onFoodsSelected(selectedIds);
        }
    }, [selectedFoodItems, onFoodsSelected]);

    const selectedFoodItemsCount = Object.values(selectedFoodItems).filter(Boolean).length;

    return (
        <div className='w-[80%] mb-4 relative select-none'>
            <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-full p-2 border border-accent rounded-lg flex justify-between items-center cursor-pointer'
            >
                <span>
                    {selectedFoodItemsCount
                        ? `Food Selected (${selectedFoodItemsCount})`
                        : 'Select Foods'
                    }
                </span>
                <IoIosArrowDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
                <div className='absolute top-full left-0 w-full max-h-60 bg-white border border-accent rounded-lg mt-1 p-2 z-10 overflow-y-auto'>
                    {foods.length === 0 ? (
                        <div className="py-2 text-center text-gray-500">No food items available</div>
                    ) : (
                        foods.map((foodItem) => {
                            const itemId = foodItem.uniqueId || foodItem._id;
                            return (
                                <FoodDropDownItem
                                    key={itemId}
                                    foodItemKey={itemId}
                                    name={foodItem.name[i18n.language] || foodItem.name.en}
                                    isChecked={Boolean(selectedFoodItems[itemId])}
                                    onCheckChange={(newValue) => {
                                        console.log('Changing:', itemId, 'to', newValue);
                                        setSelectedFoodItems(prev => {
                                            const newState = { ...prev };
                                            newState[itemId] = newValue;
                                            return newState;
                                        });
                                    }}
                                />
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default FoodDropDown;
