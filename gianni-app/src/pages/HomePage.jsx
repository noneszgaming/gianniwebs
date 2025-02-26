/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import Card from '../components/Card'
import BoxCard from '../components/BoxCard';

const HomePage = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/food`);
        const data = await response.json();
        const availableFoods = data.filter(food => food.available);
        setFoods(availableFoods);
      } catch (error) {
        console.error('Error fetching foods:', error);
      }
    };
    fetchFoods();
  }, []);
  
  return (
    <div 
      className='w-full h-fit grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-y-40 pt-[4%] pb-[4%]'
      style={{ zIndex: 1 }}
    >
      <BoxCard 
        name="Box" description="Finom Box" price="5000" img={[]} id="lel123456789" 
      />
      {foods.map((food) => (
        <Card
          key={food.id}
          id={food.id}
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