/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import DeleteBtn from './buttons/DeleteBtn';
import AmountCounter from './AmountCounter';
import MiniAdminItemBtn from './admin/MiniAdminItemBtn';
import { GoPencil } from "react-icons/go";
import AvailabilityToggle from './admin/AvailabilityToggle';

const Item = ({ id, name, description, price, count, img, available, onUpdate }) => {
  const handleRemove = () => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = currentCart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className='w-full min-w-full h-48 flex justify-between items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl px-8 mb-10'>
        <div className='h-full flex justify-center items-center gap-4'>
            <img
                className='aspect-square h-[80%] min-h-[80%] object-cover rounded-[26px] bg-amber-200'
                src={img}
                alt=""
            />
            <div className='flex flex-col justify-center items-start'>
                <h2 className='text-2xl font-bold text-center'>
                    {name}
                </h2>
                <p className='text-md'>
                    {description}
                </p>
            </div>
        </div>

        <div className='flex justify-center items-end gap-7'>

            {location.pathname.startsWith('/admin/') && location.pathname !== '/admin' &&
                <div className={`flex justify-center items-end gap-7`}>
                    <AvailabilityToggle
                        itemId={id} 
                        initialAvailability={available}
                        onToggle={() => onUpdate()}
                    />

                    <MiniAdminItemBtn onClick={null} >
                        <GoPencil className='w-6 h-6 text-light' />
                    </MiniAdminItemBtn>
                </div>
            }

            <DeleteBtn onClick={handleRemove} />

            <div className='flex flex-col justify-center items-end gap-3'>
                <p className='text-[22px] font-bold'>{price} Ft</p>
                {!(location.pathname.startsWith('/admin/') && location.pathname !== '/admin') && 
                    <AmountCounter type='cartItem' name={name} />
                }
            </div>
        </div>
    </div>
  )
}

export default Item
