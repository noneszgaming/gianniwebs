/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useRef } from 'react'
import { FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Password = ({ onChange, className, type }) => {
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);
    const [isPasswordShowed, setIsPasswordShowed] = useState(false);
    const inputRef = useRef(null);

    const handleShowPassword = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsPasswordShowed(prev => !prev);
        inputRef.current.focus();
    }

    return (
        <div className='w-full flex justify-between items-center gap-2'>
            <div className={`w-full h-12 bg-light rounded-xl flex justify-start items-center px-3 relative border-[2px] shadow-2xl shadow-black/60 ${isPasswordFocused ? 'border-accent' : 'border-light'} ${className}`}>
                <h2 
                    className={`absolute font-semibold lg:text-xl duration-500 select-none
                        ${isPasswordFocused ? 'text-dark' : ' text-dark hover:cursor-text'}
                        ${isPasswordFocused || !isPasswordEmpty ? 'left-2 -top-8 ' : 'left-12 top-[8px]'}
                    `}
                    onClick={() => inputRef.current.focus()}
                >
                    Password
                </h2>
                <FaLock className={`w-5 h-5 duration-500 ${isPasswordFocused ? 'text-accent' : 'text-slate-800'}`}/>
                <input
                    ref={inputRef}
                    type={isPasswordShowed ? "text" : "password"}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    onChange={(e) => {
                        setIsPasswordEmpty(e.target.value.length === 0); 
                        onChange(e);
                    }}
                    className={`w-full h-12 outline-none bg-transparent lg:text-xl rounded-xl px-3 caret-accent_green_dark 
                        ${isPasswordFocused ? 'text-accent selection:text-light' : 'text-slate-800'}
                    `}
                />
                <div
                    className={`w-9 h-8 flex justify-center items-center rounded-full duration-500 hover:bg-zinc-300 
                        ${isPasswordFocused ? 'opacity-100 hover:cursor-pointer' : 'opacity-0 hover:cursor-default'}
                    `}
                    onClick={handleShowPassword}
                >
                    {isPasswordShowed ? 
                        <FaRegEyeSlash className='w-5 h-5 text-accent'/> :
                        <FaRegEye className='w-5 h-5 text-accent'/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Password