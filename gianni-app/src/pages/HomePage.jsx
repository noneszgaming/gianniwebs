/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import Card from '../components/Card'
import { LanguageContext } from '../context/LanguageContext'

const HomePage = () => {
  const [foods, setFoods] = useState([]);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/food/${language}`);
        const data = await response.json();
        setFoods(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };
    fetchFoods();
  }, [language]);

  return (
    <div 
      className='w-full h-fit grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-y-40 pt-[2%] pb-[4%]'
      style={{ zIndex: 1 }}
    >
      {foods.map((food) => (
        <Card
          key={food._id}
          id={food._id}
          name={food.name}
          description={food.description}
          price={food.price}
          img={food.img}
        />
      ))}
    </div>
  )
}

export default HomePage