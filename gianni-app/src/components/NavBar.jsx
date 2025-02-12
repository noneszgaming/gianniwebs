import React, { useEffect, useState } from 'react'
import CartBtn from './buttons/CartBtn'
import HomeBtn from './buttons/HomeBtn'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSignals } from '@preact/signals-react/runtime'
import { isWebshopOpen } from '../signals'
import NavBarBtn from './admin/NavBarBtn'
import OpenCloseToggle from './admin/OpenCloseToggle'

const NavBar = ({ type }) => {
  const [cartCount, setCartCount] = useState(0);
  useSignals();

  const location = useLocation();
  const navigate = useNavigate();

  const showAdminControls = location.pathname.startsWith('/admin/') && location.pathname !== '/admin/';

  useEffect(() => {
    // WebSocket connection for store state - no auth needed for receiving updates
    const ws = new WebSocket('ws://localhost:3001/ws');
    
    ws.onopen = () => {
        console.log('WebSocket Connected');
        // Request initial state
        ws.send(JSON.stringify({ type: 'GET_STORE_STATE' }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      if (data.type === 'STORE_STATUS_UPDATE') {
          // Handle both message formats
          const state = data.state || (data.data && data.data.state);
          isWebshopOpen.value = state === 'open';
      }
  };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return () => {
        ws.close();
    };
}, []);

  return (
    <div
      className={`w-full min-h-16 h-16 flex  items-center font-poppins px-3 bg-slate-50 rounded-b-2xl select-none ${showAdminControls ? 'justify-between' : 'justify-end'}`}
      style={{ zIndex: 1 }}
    >
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

          <OpenCloseToggle />
        </div>
      )}

      <div className='flex gap-x-18'>
        <div className='flex justify-center items-center font-semibold text-lg text-neon-green gap-2 select-none'>
          <p className={`${isWebshopOpen.value ? "text-neon-green" : "text-red-600"}`}>{isWebshopOpen.value ? "OPEN" : "CLOSED"}</p>
          <span className={`w-[6px] aspect-square rounded-full relative z-10 ${
            isWebshopOpen.value 
              ? "bg-neon-green shadow-[0_0_5px_rgba(32,204,0,1),0_0_10px_rgba(32,204,0,1),0_0_15px_rgba(32,204,0,1),0_0_20px_rgba(32,204,0,1),0_0_25px_rgba(32,204,0,1)] transition-all animate-pulse" 
              : "bg-red-600 shadow-[0_0_5px_rgba(240,43,43,1),0_0_10px_rgba(240,43,43,1),0_0_15px_rgba(240,43,43,1),0_0_20px_rgba(240,43,43,1),0_0_25px_rgba(240,43,43,1)] transition-all animate-pulse"
          }`} />
        </div>
        {location.pathname !== '/' && <HomeBtn />}
        <CartBtn itemCount={cartCount} />
      </div>
    </div>
  )
}

export default NavBar


