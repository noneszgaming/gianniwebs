/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Item from '../Item';
import PrimaryBtn from '../buttons/PrimaryBtn';
import { isAddAllergeneOpened, isAddItemOpened, isWebshopOpen } from '../../signals';
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import { useSignals } from '@preact/signals-react/runtime';

const EditMenuPage = () => {
    useSignals();
    const [foods, setFoods] = useState([]);
    const [merches, setMerches] = useState([]);
    const { t, i18n } = useTranslation();
    const [allergenes, setAllergenes] = useState([]);

    const [allergeneInput, setAllergeneInput] = useState({
        hu: '',
        en: '',
        de: ''
    });


    const handleAllergeneSubmit = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/specialtypes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    name: allergeneInput
                })
            });

            if (response.ok) {
                // Clear input after successful submission
                setAllergeneInput({ hu: '', en: '', de: '' });
                isAddAllergeneOpened.value = false;
                fetchAllergenes();
            }
        } catch (error) {
            console.error('Error submitting allergene:', error);
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            const data = await response.json();

            setFoods(data.filter(item => item.type === 'food'));
            setMerches(data.filter(item => item.type === 'merch'));
        } catch (error) {
            console.log('Error fetching items:', error);
        }
    };
    const fetchAllergenes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/specialtypes`);
            const data = await response.json();
            setAllergenes(data);
        } catch (error) {
            console.error('Error fetching allergenes:', error);
        }
    };
    const deleteAllergene = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/specialtypes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.ok) {
                fetchAllergenes();
            }
        } catch (error) {
            console.error('Error deleting allergene:', error);
        }
    };


    useEffect(() => {
        fetchItems();
        fetchAllergenes();
    }, []);

    return (
        <div className='w-full h-fit grid grid-cols-3 md:grid-cols-4 justify-items-center gap-x-10 font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
            <div className="w-full col-span-3">
                <h2 className='text-3xl font-bold py-3 select-none'>Foods</h2>
                {foods.map((food) => (
                    <Item
                        key={food._id}
                        id={food._id}
                        name={food.name}
                        description={food.description}
                        available={food.available}
                        price={food.price}
                        img={food.img}
                        type={food.type}
                        onUpdate={fetchItems}
                    />
                ))}
                <h2 className='text-3xl font-bold py-3 select-none'>Merches</h2>
                {merches.map((merch) => (
                    <Item
                        key={merch._id}
                        id={merch._id}
                        name={merch.name}
                        description={merch.description}
                        available={merch.available}
                        price={merch.price}
                        img={merch.img}
                        type={merch.type}
                        onUpdate={fetchItems}
                    />
                ))}
            </div>
            <div className="w-full flex flex-col gap-10 mt-15">
                <PrimaryBtn
                    text="ADD ITEM"
                    onClick={() => {
                        isAddItemOpened.value = true;
                    }}
                />
                <div className='bg-light w-full h-fit flex flex-col justify-center items-center gap-4 rounded-[30px] px-4 pt-2 pb-4 shadow-black/50 shadow-2xl'>
                    <div className='w-full h-fit flex justify-center items-center gap-2'>
                        <h2 className='text-xl font-bold text-dark self-center'>{t("allergens.title")}</h2>
                        <button
                            className='w-8 aspect-square bg-accent hover:bg-dark-accent rounded-[8px] flex justify-center items-center duration-500 cursor-pointer'
                            onClick={() => { isAddAllergeneOpened.value = !isAddAllergeneOpened.value; }}
                        >
                            <IoIosAdd className={`w-8 h-8 text-light transition-transform duration-500 ${isAddAllergeneOpened.value ? 'rotate-45' : ''}`} />
                        </button>
                    </div>
                    {isAddAllergeneOpened.value && (
                        <div className='w-full h-fit flex flex-col gap-2'>
                            <input
                                type="text"
                                value={allergeneInput.hu}
                                onChange={(e) => setAllergeneInput({ ...allergeneInput, hu: e.target.value })}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                placeholder="Magyar név"
                            />
                            <input
                                type="text"
                                value={allergeneInput.en}
                                onChange={(e) => setAllergeneInput({ ...allergeneInput, en: e.target.value })}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                placeholder="English name"
                            />
                            <input
                                type="text"
                                value={allergeneInput.de}
                                onChange={(e) => setAllergeneInput({ ...allergeneInput, de: e.target.value })}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                placeholder="Deutsche name"
                            />
                            <button
                                onClick={handleAllergeneSubmit}
                                className='w-10 aspect-square bg-accent hover:bg-dark-accent rounded-[8px] flex justify-center items-center duration-500 cursor-pointer'
                            >
                                <MdSubdirectoryArrowLeft className='w-6 h-6 text-light' />
                            </button>
                        </div>
                    )}
                    <div className='w-full h-fit flex flex-col justify-items-center items-start gap-2'>
                        {allergenes.length === 0 ? (
                            <h2 className={`text-md text-dark self-center`}>{t("allergens.no-allergens")}</h2>
                        ) : (
                            allergenes.map((allergene) => (
                                <div key={allergene.id} className="w-full flex justify-between items-center p-2 border-b border-dark">
                                    <span>{allergene.name[i18n.language]}</span>
                                    <button
                                        onClick={() => deleteAllergene(allergene.id)}
                                        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMenuPage
