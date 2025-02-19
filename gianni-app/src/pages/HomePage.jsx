/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Card from '../components/Card'

const HomePage = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {


    const fetchFoods = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/food`);
        const data = await response.json();
        setFoods(data); // Set the fetched data to foods state
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };
    fetchFoods();
  }, []);

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
