/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext';
import Eng from './flags/GbEng';
import Hu from './flags/Hu';
import De from './flags/De';

const LanguageChangeBtn = ({ type }) => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
      <button 
          onClick={() => setLanguage(type)}
          className={`w-10 h-10 rounded-full bg-accent flex justify-center items-center cursor-pointer border-slate-900 hover:border-accent border-2 duration-500 ${language === type ? 'border-accent' : ''}`}
          style={{ zIndex: 1 }}
      >
          {type === "eng" && <Eng className='w-full h-full' />}
          {type === "hu" && <Hu className='w-full h-full' />}
          {type === "de" && <De className='w-full h-full' />}
      </button>
  );
};
export default LanguageChangeBtn