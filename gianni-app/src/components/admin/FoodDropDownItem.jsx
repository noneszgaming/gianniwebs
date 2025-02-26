/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { FaCheck } from "react-icons/fa6";

// Teljesen új komponens, nem használja a CheckBox-ot
const FoodDropDownItem = ({ foodItemKey, isChecked, onCheckChange, name }) => {
    return (
        <div className='flex items-center gap-2 py-1'>
            <div
                onClick={() => onCheckChange(!isChecked)}
                className='w-6 min-w-6 aspect-square flex justify-center items-center border-accent border-[1px] rounded-[8px] hover:cursor-pointer'
            >
                {isChecked && <FaCheck className='w-5 h-5 text-accent'/>}
            </div>
            <span>{name}</span>
        </div>
    );
};

export default FoodDropDownItem;
