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


    return (
        <div className='w-full h-screen flex justify-center items-center font-poppins text-light selection:bg-accent'>
            <form
                className='w-[80%] md:w-[26%] h-[50%] flex flex-col justify-center items-center gap-16 relative z-20'
                action='POST'
                onKeyDown={null}
            >
                <Username
                    onChange={(e) => { setUsername(e.target.value) }}
                />

                <Password
                    onChange={(e) => { setPassword(e.target.value) }}
                />

                <div className='w-full flex items-center justify-evenly'>
                    <PrimaryButton text={'Login'} to={'/admin/home'} onClick={null} />
                </div>
            </form>
        </div>
    )
}

export default AdminLogin
