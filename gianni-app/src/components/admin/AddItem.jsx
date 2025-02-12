/* eslint-disable no-unused-vars */
import { useSignal, useSignals } from '@preact/signals-react/runtime'
import React from 'react'
import PrimaryBtn from '../buttons/PrimaryBtn';
import SecondaryBtn from '../buttons/SecondaryBtn';
import { isAddItemOpened } from '../../signals';

const AddItem = () => {
    useSignals();

    return (
        <div className='absolute w-full h-full flex flex-col justify-center items-center font-poppins bg-black/70 backdrop-blur-lg' style={{ zIndex: 2 }}>
            <form className='w-[70%] h-[70%] flex flex-col justify-center items-center gap-6 bg-slate-200 rounded-3xl select-none'>
                <h2 className='font-semibold text-3xl'>Add Merch or Food</h2>
                
                <input 
                    type="text" 
                    placeholder="Name" 
                    className="w-[60%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                />
                
                <input 
                    type="text" 
                    placeholder="Description" 
                    className="w-[60%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                />
                
                <div className='w-[60%] flex justify-evenly items-center gap-4'>
                    <input 
                        type="number" 
                        min={0}
                        placeholder="Price" 
                        className="w-full p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none"
                    />
                    <p className='w-[20%] text-2xl font-semibold'>Ft</p>
                </div>
                
                <select className="w-[60%] p-2 rounded-lg border-2 border-gray-300 focus:border-accent outline-none cursor-pointer">
                    <option
                        className='bg-light '
                        value="food">Food</option>
                    <option value="merch">Merch</option>
                </select>

                <input 
                    type="file"
                    accept="image/*"
                    placeholder="Upload Image" 
                    className="w-[60%] p-2 rounded-lg border-2 text-accent border-gray-300 focus:border-accent outline-none cursor-pointer"
                />

                <div className='w-[60%] flex justify-evenly items-center'>
                    <SecondaryBtn
                        text="Cancel"
                        onClick={() => {
                            isAddItemOpened.value = false;
                            console.log(isAddItemOpened.value);
                        }}
                    />
                    <PrimaryBtn text="Add Item" />
                </div>
            </form>
        </div>
    )
}

export default AddItem