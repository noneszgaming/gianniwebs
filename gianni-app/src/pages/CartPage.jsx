/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import CartItem from '../components/CartItem';
import TotalSummaryWidget from '../components/TotalSummaryWidget';
import MerchWidget from '../components/merch/MerchWidget';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
   
    useEffect(() => {
      const handleCartUpdate = () => {
          const items = JSON.parse(localStorage.getItem('cart')) || [];
          setCartItems(items);
      };

      handleCartUpdate(); // Initial load
      window.addEventListener('cartUpdated', handleCartUpdate);
      
      return () => {
          window.removeEventListener('cartUpdated', handleCartUpdate);
      };
    }, []);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <div className='w-full h-fit grid grid-cols-3 md:grid-cols-4 justify-items-center gap-x-10 font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
            <div className="w-full col-span-3">
              {cartItems.length === 0 ? (
                    <div className="text-center text-2xl font-bold py-10">
                        Your cart is empty!
                    </div>
                ) : (
                    cartItems.map((item, index) => (
                        <CartItem
                            key={index}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            img={item.img}
                        />
                    ))
                )}
            </div>
            <div className="w-full flex flex-col gap-10">
                <TotalSummaryWidget totalPrice={calculateTotal()} />
                <MerchWidget />
            </div>
        </div>
    )
}

export default CartPage
