/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'

const FormElement = ({ label, type, width, value, onChange }) => {
    return (
      <div className={`flex flex-col justify-center items-start gap-1 ${width}`}>
          <label className='font-semibold text-lg text-slate-950 pl-2'>{label}</label>
          {label === "Note" ? (
              <textarea
                  value={value}
                  onChange={onChange}
                  className='w-full h-[100px] outline-none rounded-xl px-2 py-[5px] bg-white caret-accent focus:text-accent border-2 border-transparent  duration-500'
              />
          ) : (
              <input
                  value={value}
                  onChange={onChange}
                  className='w-full outline-none rounded-xl px-2 py-[5px] bg-white caret-accent focus:text-accent border-2 border-accent  duration-500'
                  type={type}
              />
          )}
      </div>
    )
  }
  
  export default FormElement
  