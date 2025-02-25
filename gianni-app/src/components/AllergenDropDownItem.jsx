/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import CheckBox from './CheckBox';

const AllergenDropDownItem = ({ allergenKey, isChecked, onCheckChange, t }) => {
    return (
        <div className='flex items-center gap-2 py-1'>
            <CheckBox
                isChecked={isChecked}
                setIsChecked={onCheckChange}
            />
            <span>{t(`allergens.${allergenKey}`)}</span>
        </div>
    );
};

export default AllergenDropDownItem;
