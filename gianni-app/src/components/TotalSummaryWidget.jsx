/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"

import PrimaryBtn from './buttons/PrimaryBtn'

import { useNavigate } from 'react-router-dom';

const TotalSummaryWidget = ({ totalPrice }) => {

    const navigate = useNavigate();

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
        
        // Trigger cart update events
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Reset cart total and items
        setCartTotal(0);
        setCartItems([]);
        
        // Navigate to success page or refresh current page
        navigate('/success');
      };

  

  return (
    <div className='w-full h-[300px] flex flex-col justify-evenly items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 overflow-hidden px-4'>
        <h2 className='text-2xl font-bold text-center'>
            Total Summary
        </h2>

        <div className='w-[80%] flex justify-between items-center py-3'>
            <p className='text-lg'>
                Subtotal:
            </p>
            <p className='text-[30px] font-bold'>{totalPrice} Ft</p>
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
                    name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                    email: details.payer.email_address,
                    phone: details.payer.phone?.phone_number?.national_number || '+36201234567' // Default or get from form
                  },
                  address: {
                    country: details.purchase_units[0]?.shipping?.address?.country_code || 'Hungary',
                    firstName: details.payer.name.given_name,
                    lastName: details.payer.name.surname,
                    city: details.purchase_units[0]?.shipping?.address?.admin_area_2 || '',
                    addressLine1: details.purchase_units[0]?.shipping?.address?.address_line_1 || '',
                    addressLine2: details.purchase_units[0]?.shipping?.address?.address_line_2 || '',
                    zipCode: details.purchase_units[0]?.shipping?.address?.postal_code || ''
                  },
                  items: cartItems.map(item => ({
                    _id: item._id,
                    quantity: item.quantity
                  }))
                };
            
                // Send order to backend
                fetch('http://localhost:3001/api/order', {
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
  )
}

export default TotalSummaryWidget