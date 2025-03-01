/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react'
import CartBtn from './buttons/CartBtn'
import HomeBtn from './buttons/HomeBtn'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSignals } from '@preact/signals-react/runtime'
import { isWebshopOpen, cartCount, isSidePanelOpened, storeType } from '../signals'
import NavBarBtn from './admin/NavBarBtn'
import OpenCloseToggle from './admin/OpenCloseToggle'
import LanguageChangeBtn from './LanguageChangeBtn'
import { LanguageContext } from '../context/LanguageContext'
import { useTranslation } from 'react-i18next'
import logo from '../assets/logo.png'
import icon from '/mini_logo.png'
import SidePanelBtn from './buttons/SidePanelBtn'
import SidePanel from './SidePanel'

const StoreControls = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center">
        <p className="text-sm">Public Store</p>
        <OpenCloseToggle storeType="public" />
      </div>
      <div className="flex flex-col items-center">
        <p className="text-sm">Airbnb Store</p>
        <OpenCloseToggle storeType="airbnb" />
      </div>
    </div>
  );
};


const NavBar = ({ type }) => {
  useSignals();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLangHovered, setIsLangHovered] = useState(false);
  const { language } = useContext(LanguageContext);
  const showAdminControls = location.pathname.startsWith('/admin/') && location.pathname !== '/admin/';
  const { t } = useTranslation();

  // Determine store type from URL
  useEffect(() => {
    storeType.value = location.pathname.includes('/airbnb') ? 'airbnb' : 'public';
  }, [location]);

  // Modified WebSocket logic
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({ 
        type: 'GET_STORE_STATE',
        clientId: Date.now().toString(),
        storeType: storeType.value
      }));
    };
  
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'STORE_STATUS_UPDATE' && data.storeType === storeType.value) {
        const state = data.state || (data.data && data.data.state);
        isWebshopOpen.value = state === 'open';
      }
    };
  
    return () => ws.close();
  }, [storeType.value]);

  // Modified cart handling
  useEffect(() => {
    const cartKey = `cart_${storeType.value}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [storeType.value]);

  useEffect(() => {
    const handleCartUpdate = () => {
      const cartKey = `cart_${storeType.value}`;
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      cartCount.value = cart.reduce((sum, item) => sum + item.quantity, 0);
    };
  
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [storeType.value]);
  return (
    <div 
      className={`w-full min-h-16 h-16 justify-between flex items-center font-poppins px-3 bg-slate-50 rounded-b-2xl select-none`}
      style={{ zIndex: 3000 }}
    >
      <img className='w-fit h-[80%] hidden md:block' src={logo} alt="" />
      <img className='w-fit h-[80%] md:hidden' src={icon} alt="" />
      {showAdminControls && (
        <div className='h-full flex justify-center items-center gap-x-6'>
          <p className='font-semibold text-neon-green'>ADMIN</p>
          <NavBarBtn
            text="ORDERS"
            onClick={() => navigate('/admin/orders')}
            className={location.pathname === '/admin/orders' ? 'text-accent' : 'text-black'}
          />
          <NavBarBtn
            text="EDIT MENU"
            onClick={() => navigate('/admin/edit')}
            className={location.pathname === '/admin/edit' ? 'text-accent' : 'text-black'}
          />
          <StoreControls />
        </div>
      )}

      <div className='flex items-center gap-x-18'>
        <div className='flex justify-center items-center font-semibold text-lg text-neon-green gap-2 select-none'>
          <p className={`${isWebshopOpen.value ? "text-neon-green" : "text-red-600"}`}>
            {isWebshopOpen.value ? t('store_status.open') : t('store_status.closed')}
          </p>
          <span className={`w-[6px] aspect-square rounded-full relative z-10 ${
            isWebshopOpen.value
              ? "bg-neon-green shadow-[0_0_5px_rgba(32,204,0,1),0_0_10px_rgba(32,204,0,1),0_0_15px_rgba(32,204,0,1),0_0_20px_rgba(32,204,0,1),0_0_25px_rgba(32,204,0,1)] transition-all animate-pulse"
              : "bg-red-600 shadow-[0_0_5px_rgba(240,43,43,1),0_0_10px_rgba(240,43,43,1),0_0_15px_rgba(240,43,43,1),0_0_20px_rgba(240,43,43,1),0_0_25px_rgba(240,43,43,1)] transition-all animate-pulse"
          }`} />
        </div>
        {location.pathname !== '/' && 
          <HomeBtn 
            className={"md:flex hidden"} 
            route={storeType.value === 'airbnb' ? '/airbnb' : '/'} 
          />
        }
        <div className='flex items-center gap-x-4'>
          <CartBtn 
            itemCount={cartCount.value} 
            className={"md:flex hidden"} 
            route={storeType.value === 'airbnb' ? '/airbnb/cart' : '/cart'}
          />
          <div 
            className='flex justify-center relative p-1'
            onMouseEnter={() => setIsLangHovered(true)}
            onMouseLeave={() => setIsLangHovered(false)}
          >
            <LanguageChangeBtn type={language} />
            {isLangHovered &&
              <div 
                className='absolute -top-0 p-1 w-full h-fit rounded-full bg-slate-400 flex flex-col justify-center items-center gap-2'
                style={{ zIndex: 3000 }}
              >
                <LanguageChangeBtn type="en"/>
                <LanguageChangeBtn type="hu"/>
                <LanguageChangeBtn type="de"/>
              </div>
            }
          </div>
          <SidePanelBtn />
        </div>
      </div>
    </div>
  )
}

export default NavBar

