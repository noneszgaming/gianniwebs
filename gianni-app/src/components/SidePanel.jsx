/* eslint-disable no-unused-vars */
import React from 'react'
import { cartCount, isSidePanelOpened } from '../signals'
import SidePanelBtn from './buttons/SidePanelBtn'
import CartBtn from './buttons/CartBtn'
import HomeBtn from './buttons/HomeBtn'

const SidePanel = () => {
  return (
    <div 
        className={`absolute right-0 h-16 w-[90%] bg-slate-700 rounded-l-3xl flex justify-start items-center gap-4 duration-500 ease-in-out p-4 ${isSidePanelOpened.value ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ zIndex: 4000 }}
    >
        <SidePanelBtn />
        <HomeBtn className={"flex md:hidden"} />
        <CartBtn 
            itemCount={cartCount.value} 
            className={"flex md:hidden ml-[34px]"} 
        />
    </div>
  )
}

export default SidePanel