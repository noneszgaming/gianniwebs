/* eslint-disable no-empty-pattern */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosArrowDown } from "react-icons/io";
import FoodDropDownItem from './FoodDropDownItem';

const FoodDropDown = ({ onFoodsSelected, initialSelectedIds = [] }) => {
    const { t, i18n } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFoodItems, setSelectedFoodItems] = useState({});
    const [foods, setFoods] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    
    // Debug logs
    useEffect(() => {
        console.log('Initial selected IDs in FoodDropDown:', initialSelectedIds);
    }, [initialSelectedIds]);

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
                    // Only filter available food items
                    const availableFoods = data
                        .filter(item => item.type === 'food' && item.available)
                        .map(food => ({
                            ...food,
                            uniqueId: food._id  // Use original _id as uniqueId
                        }));
                    
                    console.log('Available foods:', availableFoods);
                    setFoods(availableFoods);
                    
                    // Create a new object for selection state
                    const initialState = {};
                    
                    // First set all to false
                    availableFoods.forEach(food => {
                        initialState[food._id] = false;
                    });
                    
                    // Then set selected ones to true
                    initialSelectedIds.forEach(selectedId => {
                        // Log each ID we're looking for
                        console.log('Looking for food with ID:', selectedId);
                        
                        // Check each food item
                        availableFoods.forEach(food => {
                            // Convert IDs to strings for comparison
                            const foodId = String(food._id);
                            const selectedIdStr = String(selectedId);
                            
                            if (foodId === selectedIdStr || 
                                String(food.id) === selectedIdStr || 
                                String(food.uniqueId) === selectedIdStr) {
                                console.log('Found match for ID:', selectedId, 'Food:', food.name.en);
                                initialState[food._id] = true;
                            }
                        });
                    });
                    
                    console.log('Initial selection state:', initialState);
                    setSelectedFoodItems(initialState);
                    setIsInitialized(true);
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
    }, []);  // Only run once when component mounts

    // Handle initialSelectedIds changes separately after foods are loaded
    useEffect(() => {
        if (foods.length > 0 && initialSelectedIds.length > 0) {
            console.log('Updating selected foods based on initialSelectedIds:', initialSelectedIds);
            
            // Create a new object for selection state
            const newState = {};
            
            // First set all to false
            foods.forEach(food => {
                newState[food._id] = false;
            });
            
            // Then set selected ones to true
            initialSelectedIds.forEach(selectedId => {
                foods.forEach(food => {
                    // Convert IDs to strings for comparison
                    const foodId = String(food._id);
                    const selectedIdStr = String(selectedId);
                    
                    if (foodId === selectedIdStr || 
                        String(food.id) === selectedIdStr || 
                        String(food.uniqueId) === selectedIdStr) {
                        console.log('Marking selected:', food.name.en);
                        newState[food._id] = true;
                    }
                });
            });
            
            console.log('Updated selection state:', newState);
            setSelectedFoodItems(newState);
        }
    }, [initialSelectedIds, foods]);

    // Update parent component whenever selection changes
    useEffect(() => {
        if (!isInitialized) return;
        
        // Extract the IDs of selected food items
        const selectedIds = Object.entries(selectedFoodItems)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id)
            .filter(id => id); 
    
        console.log('Notifying parent of selected IDs:', selectedIds);
        // Call the callback with selected IDs if provided
        if (onFoodsSelected) {
            onFoodsSelected(selectedIds);
        }
    }, [selectedFoodItems, onFoodsSelected, isInitialized]);

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
                            const itemId = foodItem._id;
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
