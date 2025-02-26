/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react'
import Card from '../components/Card'
import BoxCard from '../components/BoxCard';


const HomePage = () => {
  const [foods, setFoods] = useState([]);
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch foods
        const foodResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/food`);
        const foodData = await foodResponse.json();
        const availableFoods = foodData.filter(food => food.available);
        setFoods(availableFoods);

        // Fetch boxes
        const boxResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/public/boxes');
        const boxData = await boxResponse.json();
        const availableBoxes = boxData.filter(box => box.available);
        console.log(availableBoxes);
        setBoxes(availableBoxes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  
  return (
    <div 
      className='w-full h-fit grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-y-40 pt-[4%] pb-[4%]'
      style={{ zIndex: 1 }}
    >
      <BoxCard 
        name="Box" description="Finom Box" price="5000" img={[]} id="lel123456789" 
      />
          {boxes.map((box) => (
        <BoxCard
          key={box.id}
          id={box.id}
          name={box.name} // Using Hungarian name as default
          description={box.description} // Using Hungarian description as default
          price={box.price}
          img={box.img}
          items={box.items}
        />
      ))}
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