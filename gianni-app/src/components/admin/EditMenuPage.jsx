/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Item from '../Item';
import PrimaryBtn from '../buttons/PrimaryBtn';
import { isAddItemOpened } from '../../signals';
import { useSignals } from '@preact/signals-react/runtime';

const EditMenuPage = () => {

    useSignals();

      const [foods, setFoods] = useState([]);
      const [merches, setMerches] = useState([]);
    
     useEffect(() => {
       const fetchFoods = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/food`);
         const data = await response.json();
         setFoods(data);
       };
   
       fetchFoods();
     }, []);

     useEffect(() => {
        const fetchMerchItems = async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/merch`);
            const data = await response.json();
            setMerches(data);
          } catch (error) {
            console.log('Error fetching merch items:', error);
          }
        };
    
        fetchMerchItems();
      }, []);

      const refreshData = () => {
        fetchFoods();
        fetchMerchItems();
      };

      const fetchFoods = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/food`);
        const data = await response.json();
        setFoods(data);
      };
    
      const fetchMerchItems = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/merch`);
          const data = await response.json();
          setMerches(data);
        } catch (error) {
          console.log('Error fetching merch items:', error);
        }
      };

    return (
        <div className='w-full h-fit grid grid-cols-3 md:grid-cols-4 justify-items-center gap-x-10 font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
            <div className="w-full col-span-3">
                <h2 className='text-3xl font-bold py-3 select-none'>Foods</h2>
                {foods.map((food) => (
                    <Item
                        key={food._id}
                        id={food._id}
                        name={food.name}
                        description={food.description}
                        available={food.available}
                        price={food.price}
                        img={food.img}
                        onUpdate={refreshData}
                    />
                ))}
                <h2 className='text-3xl font-bold py-3 select-none'>Merches</h2>
                {merches.map((merch) => (
                    <Item
                        key={merch._id}
                        id={merch._id}
                        name={merch.name}
                        description={merch.description}
                        available={merch.available}
                        price={merch.price}
                        img={merch.img}
                        onUpdate={refreshData}
                    />
                ))}
            </div>
            <div className="w-full flex flex-col gap-10 mt-15">
            <PrimaryBtn 
                text="ADD" 
                onClick={() => {
                    isAddItemOpened.value = true;
                    console.log('Modal opened:', isAddItemOpened.value);
                }} 
            />

            </div>
        </div>
    )
}

export default EditMenuPage
