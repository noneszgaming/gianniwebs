/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import CheckBox from './CheckBox';

const AllergenDropDownItem = ({ allergenKey, isChecked, onCheckChange, name }) => {
    return (
        <div className='flex items-center gap-2 py-1'>
            <CheckBox
                isChecked={isChecked}
                setIsChecked={onCheckChange}  // Changed from onChange to setIsChecked
            />
            <span>{name}</span>
        </div>
    );
};

export default AllergenDropDownItem;
