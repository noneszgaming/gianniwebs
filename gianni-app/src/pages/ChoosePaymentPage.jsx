/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const ChoosePaymentPage = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
    const total = storedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, []);

  const initialOptions = {
    clientId: "AUugzFtEnv8l8EOE0knHrxPMSL7G6ESl4Asw7_uJ_tC9UpvcUe06nNH12oyeV8l5e__eW0Df5pe5wmfL",
    currency: "HUF",
    intent: "capture",
  };

  const handlePaymentSuccess = (details) => {
    console.log("Sikeres fizetés!", details);
    localStorage.removeItem('cart');
  };

  return (
    <div className='w-full h-full flex justify-evenly items-center font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
      <div className='w-[25%] flex flex-col justify-center items-center gap-10 bg-blue-500 p-10 rounded-xl'>
        <h2 className='text-[34px] text-light text-center font-bold mb-10 select-none'>PayPal</h2>
        <div className='text-light text-xl mb-4'>
          Fizetendő összeg: {cartTotal} HUF
        </div>
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            className='w-[100%] h-[100%]'
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: cartTotal.toString(),
                      breakdown: {
                        item_total: {
                          value: cartTotal.toString(),
                          currency_code: "HUF"
                        }
                      }
                    },
                    items: cartItems.map(item => ({
                      name: item.name,
                      unit_amount: {
                        value: item.price.toString(),
                        currency_code: "HUF"
                      },
                      quantity: item.quantity,
                      description: item.description || ''
                    }))
                  }
                ],
                application_context: {
                  shipping_preference: "GET_FROM_FILE"
                }
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then((details) => {
                const orderData = {
                  customer: {
                    name: details.purchase_units[0]?.shipping?.name?.full_name || 'N/A',
                    email: details.payer.email_address
                    
                  },
                  items: cartItems.map(item => ({
                    _id: item._id,
                    quantity: item.quantity
                  })),
                  address: details.purchase_units[0]?.shipping?.address?.address_line_1 || 'N/A'
                };
                console.log('Order data:', orderData);
                console.log(JSON.stringify(orderData))
                // Add the missing fetch call
                fetch(`${import.meta.env.VITE_API_URL}/api/order`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(orderData)
              })
                .then(response => response.json())
                .then(data => {
                  console.log('Order created:', data);
                  handlePaymentSuccess(details);
                })
                .catch(error => {
                  console.error('Error creating order:', error);
                });
              });
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default ChoosePaymentPage;
