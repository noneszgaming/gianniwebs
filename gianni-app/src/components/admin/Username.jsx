/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import { FaUser } from "react-icons/fa";

const Username = ({ onChange, className, type }) => {

    const [isUsernameFocused, setIsUsernameFocused] = useState(false);
    const [isUsernameEmpty, setIsUsernameEmpty] = useState(true);
    const inputRef = useRef(null);

  return (
    <div className='w-full flex justify-between items-center gap-2'>
        <div className={`w-full h-12 bg-light rounded-xl flex justify-start items-center px-3 relative border-[2px] ${className}`}>
            <h2 
                className={`absolute font-semibold lg:text-xl duration-500 select-none 
                    ${isUsernameFocused ? ' text-accent' : ' text-slate-800 hover:cursor-text'}
                    ${isUsernameFocused || !isUsernameEmpty ? 'left-2 -top-8 ' : 'left-12 top-[8px]'}
                `}
                onClick={() => inputRef.current.focus()}
            >
                Username
            </h2>
            <FaUser className={`w-5 h-5 duration-500 ${isUsernameFocused ? 'text-accent' : 'text-slate-800'}`}/>
            <input 
                type="text"
                ref={inputRef}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                onChange={(e) => {
                    setIsUsernameEmpty(e.target.value.length === 0); 
                    onChange(e);
                }}
                className={`w-full h-12 outline-none bg-transparent lg:text-xl rounded-xl px-3 caret-accent ${isUsernameFocused ? 'text-accent selection:text-light' : 'text-slate-800'}`}
            />
        </div>
    </div>

  )
}

export default Username