/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import DeleteBtn from './buttons/DeleteBtn';
import AmountCounter from './AmountCounter';
import MiniAdminItemBtn from './admin/MiniAdminItemBtn';
import { GoPencil } from "react-icons/go";
import AvailabilityToggle from './admin/AvailabilityToggle';
import { cartCount, isUpdateItemOpened } from '../signals';

const API_URL = `${import.meta.env.VITE_API_URL}/api/items`;

const Item = ({ id, name, description, price, count, img, available, type, onUpdate }) => {
    
    const handleRemove = () => {
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = currentCart.filter(item => item.name !== name);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        cartCount.value = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
        
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items/${id}`, {
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
            available
        };
        console.log('Storing item data:', itemData);
        localStorage.setItem('editingItem', JSON.stringify(itemData));
        isUpdateItemOpened.value = true;
    };
  

    return (
        <div className='w-[80%] md:w-full md:min-w-full md:h-48 flex md:flex-row flex-col justify-between items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl md:px-8 mb-10 pb-[8%] md:pb-[0]'>
            <div className='h-full flex md:flex-row flex-col justify-center items-center gap-4'>
                <img
                    className='aspect-square md:w-[150px] md:min-w-[150px] w-full object-cover rounded-[26px] bg-amber-200'
                    src={img}
                    alt=""
                />
                
                <div className='w-full md:w-fit flex flex-col justify-center items-center md:items-start gap-3'>
                    <h2 className='text-2xl font-bold text-center'>{name.en}</h2>
                    <p className='text-md'>{description.en}</p>
                </div>
            </div>

            <div className='flex justify-center items-end gap-7'>
                {location.pathname.startsWith('/admin/') && location.pathname !== '/admin' && (
                    <div className={`flex justify-center items-end gap-7`}>
                        <AvailabilityToggle
                            itemId={id}
                            initialAvailability={available}
                            onToggle={() => onUpdate()}
                        />

                        <MiniAdminItemBtn onClick={handleEdit}>
                            <GoPencil className="w-6 h-6 text-light" />
                        </MiniAdminItemBtn>
                    </div>
                )}

                <DeleteBtn
                    onClick={location.pathname.startsWith('/admin/') && location.pathname !== '/admin'
                        ? handleDelete
                        : handleRemove}
                />

                <div className='flex flex-col justify-center items-end gap-3'>
                    <p className='text-[22px] font-bold'>{price} Ft</p>
                    {!(location.pathname.startsWith('/admin/') && location.pathname !== '/admin') && (
                        <AmountCounter type='cartItem' name={name} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Item
