/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Card from '../components/Card'
import BoxCard from '../components/BoxCard'

const HomePage = () => {
  const [foods, setFoods] = useState([])
  const [boxes, setBoxes] = useState([])
  const location = useLocation()
  const isAirbnbPath = location.pathname === '/airbnb'

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAirbnbPath) {
          // Fetch only boxes for /airbnb path
          const boxResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/public/boxes`)
          const boxData = await boxResponse.json()
          const availableBoxes = boxData.filter(box => box.available)
          setBoxes(availableBoxes)
        } else {
          // Fetch only foods for other paths
          const foodResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/food`)
          const foodData = await foodResponse.json()
          const availableFoods = foodData.filter(food => food.available)
          setFoods(availableFoods)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [isAirbnbPath])
  
  return (
    <div 
      className='w-full h-fit grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-y-40 pt-[4%] pb-[4%]'
      style={{ zIndex: 1 }}
    >
      {isAirbnbPath ? (
        boxes.map((box) => (
          <BoxCard
            key={box.id}
            id={box.id}
            name={box.name}
            description={box.description}
            price={box.price}
            img={box.img}
            items={box.items}
          />
        ))
      ) : (
        foods.map((food) => (
          <Card
            key={food.id}
            id={food.id}
            name={food.name}
            description={food.description}
            price={food.price}
            img={food.img}
          />
        ))
      )}
    </div>
  )
}

export default HomePage