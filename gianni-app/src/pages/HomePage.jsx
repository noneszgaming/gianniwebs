import React, { useState, useEffect } from 'react'
import Card from '../components/Card'

const HomePage = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      const response = await fetch('http://localhost:3001/api/food');
      const data = await response.json();
      setFoods(data);
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
