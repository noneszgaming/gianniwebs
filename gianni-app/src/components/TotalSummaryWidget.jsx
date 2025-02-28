/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import PrimaryBtn from './buttons/PrimaryBtn'
import { useNavigate, useLocation } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { isSuccessfulPaymentOpened } from '../signals';
import FormElement from './FormElement';
import CheckBox from './CheckBox';
import { useTranslation } from 'react-i18next';
import { isWebshopOpen } from '../signals';

const TotalSummaryWidget = ({ totalPrice }) => {
  const location = useLocation();
  const orderType = location.pathname.includes('/airbnb') ? 'airbnb' : 'public';
  const cartKey = orderType === 'airbnb' ? 'cart_airbnb' : 'cart_public';

  useSignals();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCheckedInstantDelivery, setIsCheckedInstantDelivery] = useState(true);
  const [isCheckedAcceptTerms, setIsCheckedAcceptTerms] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [isValidMobile, setIsValidMobile] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
 
  useEffect(() => {
    // Get cart from the correct storage key
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(storedCart);
    const total = storedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartKey]);
 
  // Update when cart changes
  useEffect(() => {
    const handleCartUpdated = () => {
      const updatedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCartItems(updatedCart);
      const total = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setCartTotal(total);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => window.removeEventListener('cartUpdated', handleCartUpdated);
  }, [cartKey]);

  const initialOptions = {
    clientId: "AUugzFtEnv8l8EOE0knHrxPMSL7G6ESl4Asw7_uJ_tC9UpvcUe06nNH12oyeV8l5e__eW0Df5pe5wmfL",
    currency: "HUF",
    intent: "capture",
  };
 
  const handlePaymentSuccess = (details) => {
    console.log("Sikeres fizetés!", details);
    localStorage.removeItem(cartKey);
   
    // Trigger cart update events
    window.dispatchEvent(new Event('cartUpdated'));
   
    // Reset cart total and items
    setCartTotal(0);
    setCartItems([]);
   
    // Navigate to home page and opens successful payment modal
    navigate('/');
    isSuccessfulPaymentOpened.value = true;
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      options.push(`${hour.toString().padStart(2, '0')}:00`);
      options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return options;
  };

  const validateMobile = (number) => {
    const digitsOnly = number.replace(/\D/g, '');
   
    // For numbers starting with + (international format)
    if (number.startsWith('+')) {
      return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }
   
    // For numbers without + prefix
    return digitsOnly.length >= 10 && digitsOnly.length <= 15;
  };

  const handleMobileChange = (e) => {
    const number = e.target.value;
    setMobileNumber(number);
    setIsValidMobile(validateMobile(number));
  };
    const createOrderData = (details) => {
      console.log('Cart items before processing:', cartItems);
  
      const baseOrderData = {
        paymentId: details.id,
        order_type: orderType,
        customer: {
          name: details.payer.name.given_name + ' ' + details.payer.name.surname,
          email: details.payer.email_address,
          phone: mobileNumber
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
        items: cartItems.map(item => {
          console.log('Processing item:', item);
          // Extract the base ID (remove duplicate suffix if present)
          const baseId = item.id.split('_duplicate_')[0];
      
          // Create the basic item data
          const itemData = {
            _id: baseId,
            quantity: item.quantity || 1
          };
      
          // Initialize specialTypes array if not already present
          if (!itemData.specialTypes) {
            itemData.specialTypes = [];
          }
      
          // Handle existing specialTypes
          if (item.specialTypes && item.specialTypes.length > 0) {
            itemData.specialTypes = [...item.specialTypes];
          }
      
          // Handle allergenes - add MongoDB IDs as specialTypes
          if (item.allergenes) {
            console.log('Processing allergenes:', item.allergenes);
        
            // For each key in allergenes object that is not "undefined" and has value true
            Object.entries(item.allergenes).forEach(([key, value]) => {
              if (key !== "undefined" && value === true) {
                // Check if it's a valid MongoDB ID (24 hex chars)
                if (/^[0-9a-fA-F]{24}$/.test(key)) {
                  itemData.specialTypes.push(key);
                }
              }
            });
          }
      
          // Only include specialTypes if it has items
          if (itemData.specialTypes.length === 0) {
            delete itemData.specialTypes;
          }
      
          console.log('Final item data:', itemData);
          return itemData;
        }),
        termsAccepted: isCheckedAcceptTerms,
        deliveryDate: !isCheckedInstantDelivery ? document.querySelector('input[type="date"]').value : null,
        deliveryTime: !isCheckedInstantDelivery ? document.querySelector('select').value : null
      };
      console.log('Final order data:', baseOrderData);
      return baseOrderData;
    };
  
  

  return (
    <div
      className='w-full min-w-full h-fit flex flex-col justify-evenly items-center gap-5 bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 overflow-hidden px-4 py-4'
      style={{ zIndex: 1 }}
    >
      <h2 className='text-2xl font-bold text-center'>
        {t('summary.title')}
      </h2>

      <div className='md:w-[80%] w-full flex flex-col justify-between items-center'>
        <p className='text-lg'>
          {t('summary.subtotal')}:
        </p>
        <p className='text-[30px] font-bold'>{totalPrice} Ft</p>
      </div>
      <FormElement
        label={t('summary.mobile')}
        type="tel"
        width="md:w-[80%] w-full"
        value={mobileNumber}
        onChange={handleMobileChange}
      />
      <div className='flex flex-col justify-start items-center gap-8'>
        <div className='flex flex-col justify-start items-start gap-3'>
          <div className="flex items-center gap-2">
            <CheckBox isChecked={isCheckedAcceptTerms} setIsChecked={setIsCheckedAcceptTerms} />
            <label
              className="text-lg text-slate-950 select-none"
              htmlFor="instantDelivery"
            >
              {t('summary.terms.accept')} <span className='text-accent cursor-pointer hover:border-b'>{t('summary.terms.termsAndConditions')}</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <CheckBox isChecked={isCheckedInstantDelivery} setIsChecked={setIsCheckedInstantDelivery} />
            <label
              className="text-lg text-slate-950 cursor-pointer select-none"
              htmlFor="instantDelivery"
            >
              {t('summary.delivery.instant')}
            </label>
          </div>
        </div>

        {!isCheckedInstantDelivery && (
          <div className="flex items-center gap-4">
            <input
              type="date"
              min={defaultDate}
              max={defaultDate}
              defaultValue={defaultDate}
              className="px-4 py-2 rounded-lg bg-white text-accent outline-none border-2 border-accent"
            />
            <select className="px-4 py-2 rounded-lg bg-white text-accent outline-none border-2 border-accent">
              {generateTimeOptions().map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {isCheckedAcceptTerms && isValidMobile && isWebshopOpen.value ? (
        <div className='w-[80%] h-fit'>
          <PayPalScriptProvider className='h-[50px]' options={initialOptions}>
            <PayPalButtons
              className='w-[100%] h-[100%]'
              createOrder={(data, actions) => {
                const orderData = {
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
                      items: cartItems.map(item => {
                        // Get appropriate name based on the current language or fallback to Hungarian
                        const itemName = typeof item.name === 'object' ?
                          (item.name[localStorage.getItem('i18nextLng') || 'hu'] || item.name.hu) :
                          item.name;
                        
                        const itemDesc = typeof item.description === 'object' ?
                          (item.description[localStorage.getItem('i18nextLng') || 'hu'] || item.description.hu) :
                          (item.description || '');
                        
                        // Handle allergenes if available
                        const allergenesInfo = item.allergenes ?
                          Object.keys(item.allergenes)
                            .filter(key => key !== 'undefined' && item.allergenes[key])
                            .join(', ') :
                          '';
                        
                        // Box type items with nested items
                        if (item.type === 'box' && item.items && item.items.length > 0) {
                          return {
                            name: itemName,
                            unit_amount: {
                              value: item.price.toString(),
                              currency_code: "HUF"
                            },
                            quantity: item.quantity || 1,
                            description: `${itemDesc}${allergenesInfo ? ` | Allergenes: ${allergenesInfo}` : ''}`,
                          };
                        }
                        
                        // Regular food or merch items
                        return {
                          name: `${itemName}${item.specialTypes ? ` (${item.specialTypes.join(', ')})` : ''}`,
                          unit_amount: {
                            value: item.price.toString(),
                            currency_code: "HUF"
                          },
                          quantity: item.quantity || 1,
                          description: `${itemDesc}${allergenesInfo ? ` | Allergenes: ${allergenesInfo}` : ''}`,
                        };
                      })
                    }
                  ],
                  application_context: {
                    shipping_preference: "GET_FROM_FILE"
                  }
                };
                
                // Debug output to see what's being sent to PayPal
                console.log('PayPal Order Data:', JSON.stringify(orderData, null, 2));
                
                return actions.order.create(orderData);
              }}
              
            
              onApprove={(data, actions) => {
                setIsProcessingPayment(true);
                return actions.order.capture().then((details) => {
                  const orderData = createOrderData(details);
                  console.log('Order Data:', orderData);
                 
                  fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                  })
                  .then(response => response.json())
                  .then(data => {
                    return fetch(`${import.meta.env.VITE_API_URL}/api/send-order-email`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(orderData)
                    });
                  })
                  .then(() => {
                    handlePaymentSuccess(details);
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  })
                  .finally(() => {
                    setIsProcessingPayment(false);
                  });
                });
              }}
            />
          </PayPalScriptProvider>
        </div>
      ):(<></>)}
      
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent"></div>
        </div>
      )}
    </div>
  )
}

export default TotalSummaryWidget
