/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Item from '../Item';
import PrimaryBtn from '../buttons/PrimaryBtn';
import { isAddAllergeneOpened, isAddBoxOpened, isAddItemOpened, isWebshopOpen } from '../../signals';
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useTranslation } from 'react-i18next';
import { useSignals } from '@preact/signals-react/runtime';
import DeleteBtn from '../buttons/DeleteBtn';

const EditMenuPage = () => {
    useSignals();
    const [foods, setFoods] = useState([]);
    const [merches, setMerches] = useState([]);
    const { t, i18n } = useTranslation();
    const [allergenes, setAllergenes] = useState([]);
    const [users, setUsers] = useState([]);
    const [isAddUserOpened, setIsAddUserOpened] = useState(false);
    const [boxes, setBoxes] = useState([]);
    const [endDate, setEndDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [allergeneInput, setAllergeneInput] = useState({ hu: '', en: '', de: '' });

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

    const handleUserSubmit = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    end_date: endDate,
                    start_date: startDate
                })
            });
    
            if (response.ok) {
                setEndDate('');
                setStartDate('');
                setIsAddUserOpened(false);
                fetchUsers();
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
    
            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    
    const fetchBoxes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/boxes`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            const data = await response.json();
            setBoxes(data);
        } catch (error) {
            console.error('Error fetching boxes:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
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
        fetchUsers();
        fetchBoxes();
    }, []);

    return (
        <div className='w-full h-fit grid grid-cols-3 md:grid-cols-4 justify-items-center gap-x-10 font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
            <div className="w-full col-span-3">
                <h2 className='text-3xl font-bold py-3 select-none'>Boxes</h2>
                {boxes.map((box) => (
                    <Item
                        key={box._id}
                        id={box._id}
                        name={box.name}
                        description={box.description}
                        available={box.available}
                        price={box.price}
                        img={box.img}
                        type="box"
                        items={box.items}
                        onUpdate={fetchBoxes}
                    />
                ))}
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
                <PrimaryBtn
                    text="ADD BOX"
                    onClick={() => {
                        isAddBoxOpened.value = true;
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
                                <div key={allergene.id} className="w-full flex justify-between items-center p-2">
                                    <span>{allergene.name[i18n.language]}</span>
                                    <DeleteBtn 
                                        onClick={() => deleteAllergene(allergene.id)}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className='bg-light w-full h-fit flex flex-col justify-center items-center gap-4 rounded-[30px] px-4 pt-2 pb-4 shadow-black/50 shadow-2xl'>
                    <div className='w-full h-fit flex justify-center items-center gap-2'>
                        <h2 className='text-xl font-bold text-dark self-center'>Users</h2>
                        <button
                            className='w-8 aspect-square bg-accent hover:bg-dark-accent rounded-[8px] flex justify-center items-center duration-500 cursor-pointer'
                            onClick={() => setIsAddUserOpened(!isAddUserOpened)}
                        >
                            <IoIosAdd className={`w-8 h-8 text-light transition-transform duration-500 ${isAddUserOpened ? 'rotate-45' : ''}`} />
                        </button>
                    </div>
                    {isAddUserOpened && (
                        <div className='w-full h-fit flex flex-col gap-2'>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                            />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                            />
                            <button
                                onClick={handleUserSubmit}
                                className='w-10 aspect-square bg-accent hover:bg-dark-accent rounded-[8px] flex justify-center items-center duration-500 cursor-pointer'
                            >
                                <MdSubdirectoryArrowLeft className='w-6 h-6 text-light' />
                            </button>
                        </div>
                    )}
                    <div className='w-full h-fit flex flex-col justify-items-center items-start gap-2'>
                        {users.length === 0 ? (
                            <h2 className='text-md text-dark self-center'>No users found</h2>
                        ) : (
                            users.map((user) => (
                                <div key={user.id} className="w-full flex justify-between items-center p-2">
                                    <div className="flex flex-col">
                                        <span>Username: {user.username}</span>
                                        <span>Password: {user.password}</span>
                                        <span>Expires: {new Date(user.end_date).toLocaleDateString()}</span>

                                    </div>
                                    <DeleteBtn onClick={() => deleteUser(user.id)} />
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
