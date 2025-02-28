/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { BiDuplicate } from "react-icons/bi";
import { cartCount } from '../../signals';
import { toast } from 'react-hot-toast';

const DuplicateItemBtn = ({ className, item }) => {
  const handleDuplicate = () => {
    if (!item) return;
   
    // Determine cart type from URL
    const isAirbnb = window.location.pathname.includes('/airbnb');
    const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
   
    // Get current cart
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
   
    // Create a completely unique identifier for the item
    const uniqueId = `${item.id || ''}_duplicate_${Date.now()}`;
   
    // Create a duplicate with the unique identifier but keep the original name
    const duplicatedItem = {
      ...item,
      id: uniqueId, // Override the id to make it unique
      originalId: item.id, // Save the original id for reference
      quantity: 1 // Start with 1 quantity
    };
   
    // Add to cart
    const updatedCart = [...currentCart, duplicatedItem];
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
   
    // Update cart count
    cartCount.value = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
   
    // Trigger cart update event
    window.dispatchEvent(new Event('cartUpdated'));
   
    // Notify user
    toast.success('Item duplicated');
  };

  return (
    <button
      className={`relative w-10 h-10 flex justify-center items-center bg-accent hover:bg-dark-accent duration-500 rounded-[8px] cursor-pointer ${className}`}
      onClick={handleDuplicate}
      title="Duplicate item"
    >
      <BiDuplicate className='w-[24px] h-[24px] text-light'/>
    </button>
  );
};

export default DuplicateItemBtn;
