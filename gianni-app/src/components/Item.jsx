/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect, useRef } from 'react'
import DeleteBtn from './buttons/DeleteBtn';
import AmountCounter from './AmountCounter';
import MiniAdminItemBtn from './admin/MiniAdminItemBtn';
import { GoPencil } from "react-icons/go";
import AvailabilityToggle from './admin/AvailabilityToggle';
import { cartCount, isUpdateBoxOpened, isUpdateItemOpened, isWebshopOpen } from '../signals';
import { LanguageContext } from '../context/LanguageContext';
import AllergenDropDown from './AllergenDropDown';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import FoodDropDown from './admin/FoodDropDown';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next'
import DuplicateItemBtn from './buttons/DuplicateItemBtn';

const API_URL = `${import.meta.env.VITE_API_URL}/api/items`;

const Item = ({ id, name, description, price, count, img, available, type, onUpdate, items, allergenes }) => {
    const { language } = useContext(LanguageContext)
    const isAdminItemPage = location.pathname.startsWith('/admin/') && location.pathname !== '/admin';
    const { t } = useTranslation();
    
    // Image swiper states for box type
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef(null);
    
    // Use items' images if available, otherwise use placeholder
    const images = type === 'box' && items && items.length > 0
        ? items.map(item => item.img)
        : [img || '']; // Fallback to provided img or empty string
    
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        resetInterval();
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        resetInterval();
    };

    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 3000);
        }
    };

    useEffect(() => {
        if (type === 'box' && images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 3000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [images.length, type]);

    const handleAllergenChange = (updatedAllergenes) => {
        const isAirbnb = window.location.pathname.includes('/airbnb');
        const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
        
        const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const itemIndex = currentCart.findIndex(item =>
            item.id === id ||
            (typeof name === 'object' && item.name?.en === name.en)
        );
        
        if (itemIndex !== -1) {
            if (JSON.stringify(currentCart[itemIndex].allergenes) !== JSON.stringify(updatedAllergenes)) {
                currentCart[itemIndex].allergenes = updatedAllergenes;
                localStorage.setItem(cartKey, JSON.stringify(currentCart));
            }
        }
    };

    const handleRemove = () => {
        const isAirbnb = window.location.pathname.includes('/airbnb');
        const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
        
        const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        // Filter by item ID instead of name to properly handle duplicates
        const updatedCart = currentCart.filter(item => item.id !== id);
        
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        cartCount.value = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new Event('cartUpdated'));
    };    

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            
            const endpoint = type === 'box'
                ? `${import.meta.env.VITE_API_URL}/api/boxes/${id}`
                : `${import.meta.env.VITE_API_URL}/api/items/${id}`;
            
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                onUpdate();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEdit = () => {
        const itemData = {
            id,
            name: {
                en: name.en,
                hu: name.hu,
                de: name.de
            },
            description: {
                en: description.en,
                hu: description.hu,
                de: description.de
            },
            price,
            type,
            img,
            available,
            items: items // Make sure to include items for boxes
        };
        console.log('Storing item data:', itemData);
        localStorage.setItem('editingItem', JSON.stringify(itemData));
        isUpdateItemOpened.value = true;
    };

    const handleBoxEdit = () => {
        try {
            // Ensure we have the complete box data
            if (type !== 'box') {
                console.error('handleBoxEdit called on non-box item');
                return;
            }
            
            // Extract item IDs from the items array
            const itemIds = items ? items.map(item => item._id || item.id) : [];
            
            // Prepare complete box data
            const boxData = {
                id,
                _id: id, // Include both formats to be safe
                name: {
                    en: name.en || (typeof name === 'object' ? name.en : name),
                    hu: name.hu || (typeof name === 'object' ? name.hu : name),
                    de: name.de || (typeof name === 'object' ? name.de : name)
                },
                description: {
                    en: description.en || (typeof description === 'object' ? description.en : description),
                    hu: description.hu || (typeof description === 'object' ? description.hu : description),
                    de: description.de || (typeof description === 'object' ? description.de : description)
                },
                price,
                type: 'box', // Ensure type is set explicitly
                img,
                available,
                items: itemIds, // Store just the IDs of the items
                fullItems: items // Store the full item objects for reference if needed
            };
            
            console.log('Storing box data for editing:', boxData);
            
            // Save to localStorage for the edit form to use
            localStorage.setItem('editingBox', JSON.stringify(boxData));
            
            // Toggle the box editing signal
            if (typeof isUpdateBoxOpened !== 'undefined') {
                isUpdateBoxOpened.value = true;
            } else {
                console.error('isUpdateBoxOpened signal is not defined');
            }
        } catch (error) {
            console.error('Error in handleBoxEdit:', error);
        }
    };    

    // Add this function to the Item component
    const handleUpdateBoxItems = async (selectedIds) => {
        if (!isAdminItemPage || type !== 'box') return;
   
        try {
        const token = localStorage.getItem('adminToken');
       
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes/${id}`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
            items: selectedIds
            })
        });
   
        if (response.ok) {
            toast.success('Box contents updated');
            if (onUpdate) onUpdate();
        } else {
            toast.error('Failed to update box contents');
        }
        } catch (error) {
        console.error('Error updating box items:', error);
        }
    };  

    return (
        <div className='w-[80%] md:w-full md:min-w-full md:h-48 flex md:flex-row flex-col justify-between items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl md:px-8 mb-10 pb-[8%] md:pb-[0]'>
            <div className='h-full flex md:flex-row flex-col justify-center items-center gap-4'>
                {type === 'box' ? (
                    <div className='relative md:w-[150px] md:min-w-[150px] w-full'>
                        <div className='overflow-hidden rounded-[26px]'>
                            <div
                                className='flex transition-transform duration-500 ease-in-out'
                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            >
                                {images.map((image, index) => (
                                    <img
                                        key={index}
                                        className='aspect-square md:w-[150px] md:min-w-[150px] w-full object-cover flex-shrink-0 rounded-[26px] bg-amber-200'
                                        src={image}
                                        alt=""
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 p-1 rounded-full hover:bg-white/80 transition-colors cursor-pointer'
                                >
                                    <FaChevronLeft className='text-black text-xs w-3 h-3' />
                                </button>
                                
                                <button
                                    onClick={nextImage}
                                    className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 p-1 rounded-full hover:bg-white/80 transition-colors cursor-pointer'
                                >
                                    <FaChevronRight className='text-black text-xs w-3 h-3' />
                                </button>
                            </>
                        )}
                        
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {images.length > 1 && images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 rounded-full cursor-pointer transition-all duration-500 ${
                                        currentImageIndex === index
                                            ? 'w-8 bg-primary relative overflow-hidden'
                                            : 'w-3 bg-white/70'
                                    }`}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        resetInterval();
                                    }}
                                >
                                    {currentImageIndex === index && (
                                        <div
                                            className="absolute top-0 left-0 h-full bg-white/80"
                                            style={{
                                                width: '100%',
                                                animation: 'progressAnimation 3s linear forwards'
                                            }}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <img
                        className='aspect-square md:w-[150px] md:min-w-[150px] w-full object-cover rounded-[26px] bg-amber-200'
                        src={img}
                        alt=""
                    />
                )}
                <div className='w-full md:w-fit flex flex-col justify-center items-center md:items-start gap-3'>
                    <h2 className='text-2xl font-bold text-center'>
                        {typeof name === 'object' ? name[language] : name}
                    </h2>
                    <p className='text-md'>
                        {typeof description === 'object' ? description[language] : description}
                    </p>
                    <div className='flex justify-center items-center gap-2'>
                        {(!isAdminItemPage && (type === 'food' || type === 'box' || count)) && (
                            <div className='flex justify-center items-center gap-2'>
                                <AllergenDropDown 
                                    initialSelectedAllergenes={allergenes || {}} 
                                    onAllergenChange={handleAllergenChange}
                                />
                                <DuplicateItemBtn 
                                    item={{
                                        id,
                                        name,
                                        description,
                                        price,
                                        img,
                                        quantity: 1,
                                        type,
                                        items,
                                        allergenes
                                    }} 
                                />
                            </div>
                        )}
                        {(type === 'box') && (
                            isAdminItemPage ? (
                                <FoodDropDown
                                    initialSelectedIds={items ? items.map(item => item._id || item.id) : []}
                                    onFoodsSelected={(selectedIds) => {
                                        // Only update if the user is on the admin page and this is a box
                                        if (isAdminItemPage && type === 'box') {
                                            // Compare with current items to avoid unnecessary updates
                                            const currentItemIds = items ? items.map(item => item._id || item.id) : [];
                                            const hasChanges = JSON.stringify(currentItemIds.sort()) !== JSON.stringify(selectedIds.sort());
                                            
                                            if (hasChanges) {
                                                handleUpdateBoxItems(selectedIds);
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                // For cart view, we still want to see box contents but not edit them
                                <div className="text-sm text-gray-500 italic">
                                    {items && items.length > 0 ? 
                                        `${items.map(i => i.name[language]).join(', ')}` : 
                                        t("emptyBox")}
                                </div>
                            )
                        )}
                    </div>

                </div>
            </div>

            <div className='flex justify-center items-end gap-7'>
                {isAdminItemPage && (
                    <div className={`flex justify-center items-end gap-7`}>
                        <AvailabilityToggle
                            itemId={id}
                            initialAvailability={available}
                            itemType={type}
                            onToggle={() => onUpdate()}
                        />
                        <MiniAdminItemBtn onClick={type === 'box' ? handleBoxEdit : handleEdit}>
                            <GoPencil className="w-6 h-6 text-light" />
                        </MiniAdminItemBtn>
                    </div>
                )}

                <DeleteBtn
                    onClick={isAdminItemPage
                        ? (isWebshopOpen.value ? null : handleDelete)
                        : handleRemove}
                />

                <div className='flex flex-col justify-center items-end gap-3'>
                    <p className='text-[22px] font-bold'>{price} Ft</p>
                    {!isAdminItemPage && (
                        <AmountCounter 
                            type='cartItem' 
                            name={name.en} 
                            id={id} 
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Item
