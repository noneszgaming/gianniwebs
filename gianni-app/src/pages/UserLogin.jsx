import React, { useState } from 'react';
import PrimaryButton from '../components/buttons/PrimaryBtn';
import Password from '../components/admin/Password';
import Username from '../components/admin/Username';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const API_URL = `${import.meta.env.VITE_API_URL}/api/user/login`;

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                navigate('/airbnb'); // Ide írd át a kívánt útvonalat
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        }
    };

    return (
        <div className='w-full h-screen flex justify-center items-center font-poppins text-light selection:bg-accent'>
            <form
                className='w-[80%] md:w-[26%] h-[50%] flex flex-col justify-center items-center gap-16 relative z-20'
                onSubmit={handleLogin}
            >
                <Username
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Password
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className="text-accent">{error}</div>}
                <div className='w-full flex items-center justify-evenly'>
                    <PrimaryButton text={'Login'} type="submit" />
                </div>
            </form>
        </div>
    );
};

export default UserLogin;
