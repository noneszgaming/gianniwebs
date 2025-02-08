/* eslint-disable no-unused-vars */
import React from 'react'
import Card from '../components/Card'

const HomePage = () => {
  return (
    <div 
        className='w-full h-fit grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-y-40 pt-[2%] pb-[4%]'
        style={{ zIndex: 1 }}
    >
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="3000" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and" price="2700" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="2500" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="2900" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="3000" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and" price="2700" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="2500" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="2900" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and typesetting industry." price="3000" img="" />
        <Card name="Lorem Ipsum" description="Lorem Ipsum is simply dummy text of the printing and" price="2700" img="" />
    </div>
  )
}

export default HomePage