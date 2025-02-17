/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PrimaryBtn from './buttons/PrimaryBtn';
import { useTranslation } from 'react-i18next';

const SuccessfulPopup = ({ titleKey, textKey, onClick }) => {
  const { t } = useTranslation();

  return (
    <div className='absolute w-full h-full flex flex-col justify-center items-center font-poppins bg-black/70 backdrop-blur-lg' style={{ zIndex: 5000 }}>
      <div className='w-[70%] h-[70%] flex flex-col justify-center items-center gap-12 bg-slate-200 rounded-3xl select-none'>
        <h2 className='font-semibold text-[40px] text-accent'>{t("successful")} {t(titleKey)}</h2>
        <p className='font-medium text-xl'>{t(textKey)}</p>
        <PrimaryBtn text="OK" onClick={onClick} />
      </div>
    </div>
  );
};

export default SuccessfulPopup;