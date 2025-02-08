/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import FormElement from '../components/FormElement';
import PrimaryBtn from '../components/buttons/PrimaryBtn';
import { useNavigate } from 'react-router-dom';
import CheckBox from '../components/CheckBox';

const OrderDataPage = () => {

  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(true);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return options;
  };

  const handleClick = () => {
    navigate('/payment');
  };

  return (
    <div className='w-full h-full flex flex-col justify-evenly items-center font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
        <h2 className='text-[34px] font-bold'>Your Address</h2>

        <form className='w-[60%] flex flex-col gap-8 bg-card-bg px-10 py-10 rounded-[26px] shadow-black/50 shadow-2xl duration-500'>
          <div className='flex justify-between items-center gap-8'>
              <FormElement label="Full Name" type="text" width="w-[50%]" />
              <FormElement label="Street" type="text" width="w-[50%]" />
          </div>
          <div className='flex justify-between items-center gap-8'>
              <FormElement label="Phone" type="tel" width="w-[50%]" />
              <FormElement label="Floor / Door" type="text" width="w-[50%]" />
          </div>
          <div className='flex justify-between items-center gap-8'>
              <FormElement label="Email" type="email" width="w-[70%]" />
              <FormElement label="Postal Code" type="number" width="w-[30%]" />
          </div>
          <FormElement label="Note" type="text" />

          <div className='flex justify-start items-center gap-8'>
            <div className="flex items-center gap-2">
              <CheckBox isChecked={isChecked} setIsChecked={setIsChecked} />
              <label 
                className="text-lg text-light cursor-pointer select-none"
                htmlFor="instantDelivery"
              >
                Instant Delivery
              </label>
            </div>

            {!isChecked && (
              <div className="flex items-center gap-4">
                <input 
                  type="date" 
                  min={defaultDate}
                  max={defaultDate}
                  defaultValue={defaultDate}
                  className="px-4 py-2 rounded-lg bg-white text-accent outline-none border-2 border-transparent focus:border-accent"
                />
                <select className="px-4 py-2 rounded-lg bg-white text-accent outline-none border-2 border-transparent focus:border-accent">
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            )}

          </div>
        </form>

        <PrimaryBtn text="Choose Payment Method" onClick={handleClick} />

    </div>
  )
}

export default OrderDataPage