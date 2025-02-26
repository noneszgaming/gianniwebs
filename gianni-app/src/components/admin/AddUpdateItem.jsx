/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useSignal, useSignals } from '@preact/signals-react/runtime'
import React, { useState, useEffect } from 'react'
import PrimaryBtn from '../buttons/PrimaryBtn';
import SecondaryBtn from '../buttons/SecondaryBtn';
import { isAddBoxOpened, isAddItemOpened, isUpdateItemOpened, isWebshopOpen } from '../../signals';
import FoodDropDown from './FoodDropDown';

const AddUpdateItem = () => {
    useSignals();
    const [formData, setFormData] = useState({
        name: {
            en: '',
            hu: '',
            de: ''
        },
        description: {
            en: '',
            hu: '',
            de: ''
        },
        price: '',
        type: 'food',
        img: ''
    });

    useEffect(() => {
        if (isUpdateItemOpened.value) {
            const editingItem = JSON.parse(localStorage.getItem('editingItem'));
            if (editingItem) {
                setFormData({
                    name: {
                        en: editingItem.name.en,
                        hu: editingItem.name.hu,
                        de: editingItem.name.de
                    },
                    description: {
                        en: editingItem.description.en,
                        hu: editingItem.description.hu,
                        de: editingItem.description.de
                    },
                    price: editingItem.price,
                    type: editingItem.type,
                    img: editingItem.img
                });
            }
        }
    }, [isUpdateItemOpened.value]);

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3);
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
            const token = localStorage.getItem('adminToken');
            const editingItem = JSON.parse(localStorage.getItem('editingItem'));
            
            const url = isUpdateItemOpened.value
                ? `${import.meta.env.VITE_API_URL}/api/items/${editingItem.id}`
                : `${import.meta.env.VITE_API_URL}/api/items`;

            const response = await fetch(url, {
                method: isUpdateItemOpened.value ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(isUpdateItemOpened.value ? 'Item updated successfully!' : 'Item added successfully!');
                isUpdateItemOpened.value = false;
                isAddItemOpened.value = false;
                localStorage.removeItem('editingItem');
                window.location.reload();
            } else {
                throw new Error(isUpdateItemOpened.value ? 'Failed to update item' : 'Failed to add item');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(isUpdateItemOpened.value ? 'Failed to update item' : 'Failed to add item');
        }
    };

    const handleChange = (e) => {
        const [field, lang] = e.target.name.split('_');
        if (lang) {
            setFormData({
                ...formData,
                [field]: {
                    ...formData[field],
                    [lang]: e.target.value
                }
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleClose = () => {
        if (isUpdateItemOpened.value) {
            isUpdateItemOpened.value = false;
            localStorage.removeItem('editingItem');
        } else {
            isAddItemOpened.value = false;
            isAddBoxOpened.value = false;
        }
    };

    return (
        <div className='absolute w-full h-full flex flex-col justify-center items-center font-poppins bg-black/70 backdrop-blur-lg' style={{ zIndex: 5500 }}>
            {isWebshopOpen.value ? (
                <div className='w-[70%] h-[90%] flex flex-col justify-evenly items-center gap-6 bg-slate-200 rounded-3xl'>
                    <h2 className='font-semibold text-[70px] text-dark-accent text-center'>
                        Ooops!
                    </h2>
                    <h2 className='font-semibold text-3xl text-center'>
                        Items can only be edited when the store is closed!
                    </h2>
                    <SecondaryBtn
                        text="Cancel"
                        onClick={handleClose}
                    />
                </div>
            ) : (
                <form 
                    onSubmit={handleSubmit} 
                    className='w-[80%] h-[90%] flex flex-col justify-center items-center gap-6 bg-slate-200 rounded-3xl'
                >
                    <h2 className='font-semibold text-3xl'>
                        {isAddItemOpened.value && 'Add Merch or Food'}
                        {isUpdateItemOpened.value && 'Update Item'}
                        {isAddBoxOpened.value && 'Add Box'}
                    </h2>
                    
                    <div className='w-[80%] flex gap-2'>
                        <input
                            type="text"
                            name="name_en"
                            value={formData.name.en}
                            onChange={handleChange}
                            placeholder="Name (English)"
                            className="w-[100%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                        />
                        
                        <input
                            type="text"
                            name="name_hu"
                            value={formData.name.hu}
                            onChange={handleChange}
                            placeholder="Name (Hungarian)"
                            className="w-[100%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                        />
                        
                        <input
                            type="text"
                            name="name_de"
                            value={formData.name.de}
                            onChange={handleChange}
                            placeholder="Name (German)"
                            className="w-[100%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                        />
                    </div>
                    
                    <input
                        type="text"
                        name="description_en"
                        value={formData.description.en}
                        onChange={handleChange}
                        placeholder="Description (English)"
                        className="w-[80%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                    />
                    
                    <input
                        type="text"
                        name="description_hu"
                        value={formData.description.hu}
                        onChange={handleChange}
                        placeholder="Description (Hungarian)"
                        className="w-[80%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                    />
                    
                    <input
                        type="text"
                        name="description_de"
                        value={formData.description.de}
                        onChange={handleChange}
                        placeholder="Description (German)"
                        className="w-[80%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                    />

                    <div className='w-[80%] flex justify-evenly items-center gap-4'>
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

                    {(isAddItemOpened.value || isUpdateItemOpened.value) &&
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-[80%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                        >
                            <option value="food">Food</option>
                            <option value="merch">Merch</option>
                        </select>
                    }

                    {(isAddItemOpened.value || isUpdateItemOpened.value) &&
                        <input
                            type="file"
                            name="img"
                            accept="image/*"
                            onChange={handleImageChange}
                            placeholder="Upload Image"
                            className="w-[80%] p-2 rounded-lg border-2 text-accent border-gray-300 focus:border-accent outline-none"
                        />
                    }

                    {(isAddBoxOpened.value) &&
                        <FoodDropDown />
                    }

                    <div className='w-[60%] flex justify-evenly items-center'>
                        <SecondaryBtn
                            text="Cancel"
                            onClick={handleClose}
                        />
                        <PrimaryBtn 
                            text= {
                                (isAddItemOpened.value && 'Add Merch or Food') || 
                                (isUpdateItemOpened.value && 'Update Item') || 
                                (isAddBoxOpened.value && 'Add Box')
                            }
                            type="submit" 
                        />
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddUpdateItem;

