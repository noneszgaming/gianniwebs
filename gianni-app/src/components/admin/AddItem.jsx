/* eslint-disable no-unused-vars */
import { useSignal, useSignals } from '@preact/signals-react/runtime'
import React, { useState } from 'react'
import PrimaryBtn from '../buttons/PrimaryBtn';
import SecondaryBtn from '../buttons/SecondaryBtn';
import { isAddItemOpened } from '../../signals';

const AddItem = () => {
    useSignals();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        type: 'food',
        img: ''
    });

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    // Drastically reduced max width
                    const MAX_WIDTH = 400;
                    let width = img.width;
                    let height = img.height;
    
                    // Calculate new dimensions
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }
    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Maximum compression with lowest quality
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3);
                    
                    // Remove the data:image/jpeg;base64, prefix to reduce size further
                    const base64Clean = compressedBase64.split(',')[1];
                    resolve(base64Clean);
                };
            };
        });
    };
    
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const compressedBase64 = await compressImage(file);
                setFormData({
                    ...formData,
                    // Add the prefix back when storing in state
                    img: `data:image/jpeg;base64,${compressedBase64}`
                });
            } catch (error) {
                console.error('Image compression failed:', error);
                alert('Failed to process image. Please try again.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('adminToken'); // Get JWT token from storage
            
            const response = await fetch('http://localhost:3001/api/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Item added successfully!');
                isAddItemOpened.value = false;
            } else {
                throw new Error('Failed to add item');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to add item');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className='absolute w-full h-full flex flex-col justify-center items-center font-poppins bg-black/70 backdrop-blur-lg' style={{ zIndex: 2 }}>
            <form onSubmit={handleSubmit} className='w-[70%] h-[70%] flex flex-col justify-center items-center gap-6 bg-slate-200 rounded-3xl'>
                <h2 className='font-semibold text-3xl'>Add Merch or Food</h2>
                
                <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name" 
                    className="w-[60%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                />
                
                <input 
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description" 
                    className="w-[60%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                />
                
                <div className='w-[60%] flex justify-evenly items-center gap-4'>
                    <input 
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min={0}
                        placeholder="Price" 
                        className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                    />
                    <p className='w-[20%] text-2xl font-semibold'>Ft</p>
                </div>
                
                <select 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-[60%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                >
                    <option value="food">Food</option>
                    <option value="merch">Merch</option>
                </select>

                <input 
                type="file"
                name="img"
                accept="image/*"
                onChange={handleImageChange}
                placeholder="Upload Image" 
                className="w-[60%] p-2 rounded-lg border-2 text-accent border-gray-300 focus:border-accent outline-none"
                />

                <div className='w-[60%] flex justify-evenly items-center'>
                    <SecondaryBtn
                        text="Cancel"
                        onClick={() => isAddItemOpened.value = false}
                    />
                    <PrimaryBtn text="Add Item" type="submit" />
                </div>
            </form>
        </div>
    )
}

export default AddItem
