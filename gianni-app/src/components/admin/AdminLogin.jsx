/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PrimaryButton from '../buttons/PrimaryBtn';
import Password from './Password';
import Username from './Username';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    const API_URL = `${import.meta.env.VITE_API_URL}/api/admin/login`;



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
                // Store the token in localStorage
                localStorage.setItem('adminToken', data.token);
                // Store admin data if needed
                localStorage.setItem('adminData', JSON.stringify(data.admin));
                // Navigate to admin home page
                navigate('/admin/orders');
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
                className='w-[80%] md:w-[26%] h-[50%] flex flex-col justify-center items-center gap-16 relative z-20 bg-white/30 backdrop-blur-lg px-6 rounded-[30px] border-3 border-accent'
                onSubmit={handleLogin}
            >
                <h1 className='text-3xl text-dark font-bold'>Login</h1>
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

export default AdminLogin
