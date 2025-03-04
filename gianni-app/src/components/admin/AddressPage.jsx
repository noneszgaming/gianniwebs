/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { IoIosAdd } from "react-icons/io";
import { MdSubdirectoryArrowLeft } from "react-icons/md";
import DeleteBtn from '../buttons/DeleteBtn';
import PrimaryBtn from '../buttons/PrimaryBtn';
import toast, { Toaster } from 'react-hot-toast';

const AddressPage = () => {
    // User states
    const [users, setUsers] = useState([]);
    const [isAddUserOpened, setIsAddUserOpened] = useState(false);
    const [endDate, setEndDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [loading, setLoading] = useState(false);
    // Remove error state and handle errors directly with toast
    
    // Address states
    const [addresses, setAddresses] = useState([]);
    const [isAddAddressOpened, setIsAddAddressOpened] = useState(false);
    const [addressForm, setAddressForm] = useState({
        city: '',
        addressLine1: '',
        addressLine2: '',
        zipCode: ''
    });

    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
        setAddressForm({
            ...addressForm,
            [name]: value
        });
    };

    const handleUserSubmit = async () => {
        try {
            setLoading(true);

            // Ellenőrizzük, hogy valid címet választott-e
            if (!selectedAddressId) {
                toast.error('Kérjük válasszon címet!');
                setLoading(false);
                return;
            }

            // Ellenőrizzük, hogy valid dátumokat adott-e meg
            if (!startDate || !endDate) {
                toast.error('Kérjük adja meg a kezdő és lejárati dátumot!');
                setLoading(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    end_date: endDate,
                    start_date: startDate,
                    addressId: selectedAddressId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Hiba történt a felhasználó létrehozásakor');
            }

            // Sikeres felhasználó létrehozás
            toast.success('Felhasználó sikeresen létrehozva!');
            setEndDate('');
            setStartDate('');
            setSelectedAddressId('');
            setIsAddUserOpened(false);

            // Frissítsük a felhasználók listáját
            fetchUsers();

        } catch (error) {
            console.error('Hiba a felhasználó létrehozásakor:', error);
            toast.error(error.message || 'Hiba történt a felhasználó létrehozásakor');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSubmit = async () => {
        try {
            setLoading(true);

            // Ellenőrizzük, hogy minden mező ki van töltve
            if (!addressForm.city || !addressForm.addressLine1 || !addressForm.zipCode) {
                toast.error('Kérjük töltse ki a kötelező mezőket (város, cím, irányítószám)!');
                setLoading(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addresses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(addressForm)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Hiba történt a cím létrehozásakor');
            }

            // Sikeres cím létrehozás
            toast.success('Cím sikeresen létrehozva!');
            setAddressForm({
                city: '',
                addressLine1: '',
                addressLine2: '',
                zipCode: ''
            });
            setIsAddAddressOpened(false);

            // Frissítsük a címek listáját
            fetchAddresses();

        } catch (error) {
            console.error('Hiba a cím létrehozásakor:', error);
            toast.error(error.message || 'Hiba történt a cím létrehozásakor');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Biztosan törölni szeretné ezt a felhasználót?')) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Hiba történt a felhasználó törlésekor');
            }

            // Sikeres törlés, frissítsük a felhasználók listáját
            toast.success('Felhasználó sikeresen törölve!');
            fetchUsers();

        } catch (error) {
            console.error('Hiba a felhasználó törlésekor:', error);
            toast.error(error.message || 'Hiba történt a felhasználó törlésekor');
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (id) => {
        if (!window.confirm('Biztosan törölni szeretné ezt a címet?')) {
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Hiba történt a cím törlésekor');
            }

            // Sikeres törlés, frissítsük a címek listáját
            toast.success('Cím sikeresen törölve!');
            fetchAddresses();

        } catch (error) {
            console.error('Hiba a cím törlésekor:', error);
            // Ha a hiba arra utal, hogy a címet használja valamelyik felhasználó
            if (error.message.includes('in use') || error.message.includes('használja')) {
                toast.error('Ezt a címet jelenleg használja egy vagy több felhasználó! Először törölnie kell őket.');
            } else {
                toast.error(error.message || 'Hiba történt a cím törlésekor');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/all`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Hiba történt a felhasználók lekérdezésekor');
            }

            setUsers(data.users || []);

        } catch (error) {
            console.error('Hiba a felhasználók lekérdezésekor:', error);
            toast.error(error.message || 'Hiba történt a felhasználók lekérdezésekor');
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/addresses`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Hiba történt a címek lekérdezésekor');
            }

            setAddresses(data.addresses || []);

        } catch (error) {
            console.error('Hiba a címek lekérdezésekor:', error);
            toast.error(error.message || 'Hiba történt a címek lekérdezésekor');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchAddresses();
    }, []);

    return (
        <div className='w-full h-fit grid grid-cols-3 md:grid-cols-4 justify-items-center gap-x-10 font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
            {/* Toast container for displaying notifications */}
            <Toaster 
                position="top-right" 
                toastOptions={{ 
                    duration: 5000,
                    // Ensure each toast is unique by limiting duplicates
                    success: {
                        id: 'success',
                    },
                    error: {
                        id: 'error',
                    }
                }} 
            />

            <div className="w-full col-span-3">
                <h2 className='text-3xl font-bold py-3 select-none'>AirBnB Címek</h2>
                {loading && addresses.length === 0 ? (
                    <p className="text-dark py-4">Címek betöltése...</p>
                ) : addresses.length === 0 ? (
                    <p className="text-dark py-4">Nincsenek még címek. Hozzon létre egyet!</p>
                ) : (
                    addresses.map((address) => (
                        <div key={address._id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{address.city}, {address.zipCode}</h3>
                                <p>{address.addressLine1}</p>
                                {address.addressLine2 && <p>{address.addressLine2}</p>}
                            </div>
                            <DeleteBtn onClick={() => deleteAddress(address._id)} />
                        </div>
                    ))
                )}
                <h2 className='text-3xl font-bold py-3 select-none mt-6'>AirBnB Felhasználók</h2>
                {loading && users.length === 0 ? (
                    <p className="text-dark text-center py-4">Felhasználók betöltése...</p>
                ) : users.length === 0 ? (
                    <p className="text-dark text-center py-4">Nincsenek még felhasználók. Hozzon létre egyet!</p>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="w-fit bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center gap-8">
                            <div className='flex gap-8'>
                                <div className='font-medium'>
                                    <h3 className="font-bold">{user.username}</h3>
                                    <p>Jelszó: <span className='bg-dark-accent text-light px-1 rounded-lg'>{user.password}</span></p>
                                    {user.name && <p>Név: <span className='bg-dark-accent text-light px-1 rounded-lg'>{user.name}</span></p>}
                                    {user.email && <p>Email: <span className='bg-dark-accent text-light px-1 rounded-lg'>{user.email}</span></p>}
                                    {user.phone && <p>Telefon: <span className='bg-dark-accent text-light px-1 rounded-lg'>{user.phone}</span></p>}
                                    <p>Időszak: <span className='bg-dark-accent text-light px-1 rounded-lg'>{new Date(user.start_date).toLocaleDateString()}</span> - <span className='bg-dark-accent text-light px-1 rounded-lg'>{new Date(user.end_date).toLocaleDateString()}</span></p>
                                </div>
                                {user.address && (
                                    <div className="mt-2 p-2 bg-gray-200 rounded-lg">
                                        <p className="font-semibold">Cím:</p>
                                        <p>{user.address.city}, {user.address.zipCode}</p>
                                        <p>{user.address.addressLine1}</p>
                                        {user.address.addressLine2 && <p>{user.address.addressLine2}</p>}
                                    </div>
                                )}
                            </div>
                            <DeleteBtn onClick={() => deleteUser(user.id)} />
                        </div>
                    ))
                )}
            </div>

            <div className="w-full flex flex-col gap-10 mt-15">
                <div className='bg-light w-full h-fit flex flex-col justify-center items-center gap-4 rounded-[30px] px-4 pt-2 pb-4 shadow-black/50 shadow-2xl'>
                    <div className='w-full h-fit flex justify-center items-center gap-2'>
                        <h2 className='text-xl font-bold text-dark self-center'>Új AirBnB Cím</h2>
                        <button
                            className='w-8 aspect-square bg-accent hover:bg-dark-accent rounded-[8px] flex justify-center items-center duration-500 cursor-pointer'
                            onClick={() => setIsAddAddressOpened(!isAddAddressOpened)}
                            disabled={loading}
                        >
                            <IoIosAdd className={`w-8 h-8 text-light transition-transform duration-500 ${isAddAddressOpened ? 'rotate-45' : ''}`} />
                        </button>
                    </div>
                    {isAddAddressOpened && (
                        <div className='w-full h-fit flex flex-col gap-2'>
                            <input
                                type="text"
                                name="city"
                                value={addressForm.city}
                                onChange={handleAddressInputChange}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                placeholder="Város"
                                disabled={loading}
                            />
                            <input
                                type="text"
                                name="addressLine1"
                                value={addressForm.addressLine1}
                                onChange={handleAddressInputChange}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                placeholder="Cím 1"
                                disabled={loading}
                            />
                            <input
                                type="text"
                                name="addressLine2"
                                value={addressForm.addressLine2}
                                onChange={handleAddressInputChange}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                placeholder="Cím 2 (opcionális)"
                                disabled={loading}
                            />
                            <input
                                type="text"
                                name="zipCode"
                                value={addressForm.zipCode}
                                onChange={handleAddressInputChange}
                                className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                placeholder="Irányítószám"
                                disabled={loading}
                            />
                            <button
                                onClick={handleAddressSubmit}
                                className='w-10 aspect-square bg-accent hover:bg-dark-accent rounded-[8px] flex justify-center items-center duration-500 cursor-pointer'
                                disabled={loading}
                            >
                                <MdSubdirectoryArrowLeft className='w-6 h-6 text-light' />
                            </button>
                        </div>
                    )}
                </div>

                <div className='bg-light w-full h-fit flex flex-col justify-center items-center gap-4 rounded-[30px] px-4 pt-2 pb-4 shadow-black/50 shadow-2xl'>
                    <div className='w-full h-fit flex justify-center items-center gap-2'>
                        <h2 className='text-xl font-bold text-dark self-center'>Új AirBnB Felhasználó</h2>
                        <button
                            className='w-8 aspect-square bg-accent hover:bg-dark-accent rounded-[8px] flex justify-center items-center duration-500 cursor-pointer'
                            onClick={() => setIsAddUserOpened(!isAddUserOpened)}
                            disabled={loading}
                        >
                            <IoIosAdd className={`w-8 h-8 text-light transition-transform duration-500 ${isAddUserOpened ? 'rotate-45' : ''}`} />
                        </button>
                    </div>
                    {isAddUserOpened && (
                        <div className='w-full h-fit flex flex-col gap-2'>
                            <div className="flex flex-col">
                                <label htmlFor="start-date" className="text-dark mb-1">Kezdő dátum</label>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="end-date" className="text-dark mb-1">Lejárati dátum</label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none caret-accent focus:text-accent'
                                    disabled={loading}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="address-select" className="text-dark mb-1">Cím kiválasztása</label>
                                <select
                                    id="address-select"
                                    value={selectedAddressId}
                                    onChange={(e) => setSelectedAddressId(e.target.value)}
                                    className='w-full h-10 px-2 bg-light border-2 border-dark focus:border-accent rounded-[8px] outline-none focus:text-accent'
                                    disabled={loading}
                                >
                                    <option value="">Válasszon címet...</option>
                                    {addresses.map((address) => (
                                        <option key={address._id} value={address._id}>
                                            {address.city}, {address.addressLine1} ({address.zipCode})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleUserSubmit}
                                className='w-10 aspect-square bg-accent hover:bg-dark-accent rounded-[8px] flex justify-center items-center duration-500 cursor-pointer'
                                disabled={loading}
                            >
                                <MdSubdirectoryArrowLeft className='w-6 h-6 text-light' />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressPage;
