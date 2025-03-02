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

  const [isCheckedAcceptTerms, setIsCheckedAcceptTerms] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [isValidMobile, setIsValidMobile] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // New state for Airbnb customer info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidName, setIsValidName] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [cartTotal, setCartTotal] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [dateRange, setDateRange] = useState({
    min: defaultDate,
    max: defaultDate,
    default: defaultDate
  });
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  useEffect(() => {
    if (orderType === 'airbnb') {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.start_date && userData.end_date) {
        const startDate = new Date(userData.start_date).toISOString().split('T')[0];
        const endDate = new Date(userData.end_date).toISOString().split('T')[0];
        console.log(startDate, endDate);
        setDateRange({
          min: startDate,
          max: endDate,
          });
        setSelectedDate(startDate);
      }
    } else {
      setDateRange({
        min: defaultDate,
        max: defaultDate,
        default: defaultDate
      });
    }
  }, [orderType, defaultDate]);
  
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
    if (orderType === 'airbnb') {
      navigate('/airbnb');
    } else {
      navigate('/');
    }
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

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  const handleMobileChange = (e) => {
    const number = e.target.value;
    setMobileNumber(number);
    setIsValidMobile(validateMobile(number));
  };
  const handleNoteChange = (e) => {
    setOrderNote(e.target.value);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setCustomerName(name);
    setIsValidName(validateName(name));
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCustomerEmail(email);
    setIsValidEmail(validateEmail(email));
  };

  // Check if all required fields are valid for showing payment
  const areAllFieldsValid = () => {
    if (orderType === 'airbnb') {
      return isCheckedAcceptTerms && isValidMobile && isValidName && isValidEmail && isWebshopOpen.value;
    }
    return isCheckedAcceptTerms && isValidMobile && isWebshopOpen.value;
  };

  const createOrderData = (details) => {
    console.log('Cart items before processing:', cartItems);
  
    // Determine customer information based on order type
    let customerInfo = {};
    let addressInfo = {};
  
    // Get userData for address information (for Airbnb orders)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    console.log('userData from localStorage:', userData);
  
    if (orderType === 'airbnb') {
      // For Airbnb orders, use the customer's inputted information
      customerInfo = {
        name: customerName,
        email: customerEmail,
        phone: mobileNumber
      };
    
      // Use address from userData for Airbnb orders
      addressInfo = {
        _id: userData.address._id

      };
    
      // Log to verify the address data
      console.log('Airbnb address data:', addressInfo);
    

    } else {
      // For public orders, use PayPal provided information
      customerInfo = {
        name: details.payer.name.given_name + ' ' + details.payer.name.surname,
        email: details.payer.email_address,
        phone: mobileNumber
      };
    
      // Use PayPal shipping address for public orders
      addressInfo = {
        country: details.purchase_units[0]?.shipping?.address?.country_code || 'Hungary',
        firstName: details.payer.name.given_name || '',
        lastName: details.payer.name.surname || '',
        city: details.purchase_units[0]?.shipping?.address?.admin_area_2 || 'Budapest', // Default if missing
        addressLine1: details.purchase_units[0]?.shipping?.address?.address_line_1 || 'Logodi utca 44', // Default if missing
        addressLine2: details.purchase_units[0]?.shipping?.address?.address_line_2 || '',
        zipCode: details.purchase_units[0]?.shipping?.address?.postal_code || '1012' // Default if missing
      };
    }



    const baseOrderData = {
      paymentId: details.id,
      order_type: orderType,
      customer: customerInfo,
      address: addressInfo,
      note: orderNote,
      items: cartItems.map(item => {
        // Rest of the item processing code remains the same
        console.log('Processing item:', item);
        const baseId = item.id.split('_duplicate_')[0];
        const itemData = {
          _id: baseId,
          quantity: item.quantity || 1
        };

        if (!itemData.specialTypes) {
          itemData.specialTypes = [];
        }

        if (item.specialTypes && item.specialTypes.length > 0) {
          itemData.specialTypes = [...item.specialTypes];
        }

        if (item.allergenes) {
          console.log('Processing allergenes:', item.allergenes);
          Object.entries(item.allergenes).forEach(([key, value]) => {
            if (key !== "undefined" && value === true) {
              if (/^[0-9a-fA-F]{24}$/.test(key)) {
                itemData.specialTypes.push(key);
              }
            }
          });
        }

        if (itemData.specialTypes.length === 0) {
          delete itemData.specialTypes;
        }

        console.log('Final item data:', itemData);
        return itemData;
      }),
      termsAccepted: isCheckedAcceptTerms,
      deliveryDate: document.querySelector('input[type="date"]').value,
      deliveryTime: document.querySelector('select').value
    };
  
    console.log('Final order data:', baseOrderData);
    return baseOrderData;
  };  return (
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
      
      {/* Additional fields for Airbnb orders */}
      {orderType === 'airbnb' && (
        <>
          <FormElement
            label="Név"
            type="text"
            width="md:w-[80%] w-full"
            value={customerName}
            onChange={handleNameChange}
            required={true}
          />
          <FormElement
            label="Email cím"
            type="email"
            width="md:w-[80%] w-full"
            value={customerEmail}
            onChange={handleEmailChange}
            required={true}
          />
        </>
      )}
      
      <FormElement
        label={t('summary.mobile')}
        type="tel"
        width="md:w-[80%] w-full"
        value={mobileNumber}
        onChange={handleMobileChange}
      />
      <FormElement
        label={t('summary.comment')}
        type="textarea"
        width="md:w-[80%] w-full"
        value={orderNote}
        onChange={handleNoteChange}
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
        </div>

        <div className="flex items-center gap-4">
          <input
            type="date"
            min={dateRange.min}
            max={dateRange.max}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg bg-white text-accent outline-none border-2 border-accent"
          />
          <select className="px-4 py-2 rounded-lg bg-white text-accent outline-none border-2 border-accent">
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {areAllFieldsValid() ? (
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
            
                if (orderType === 'airbnb') {
                  // Airbnb-specifikus rendelés létrehozás
                  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                  // Ha a token külön van tárolva
                  const userToken = localStorage.getItem('userToken');

                  if (!userToken) {
                    console.error('Nincs felhasználói token a rendeléshez');
                    setIsProcessingPayment(false);
                    return;
                  }
            
                  fetch(`${import.meta.env.VITE_API_URL}/api/orders/airbnb`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${userToken}`
                    },
                    body: JSON.stringify(orderData)
                  })
                  .then(response => response.json())
                  .then(data => {
                    console.log('Airbnb order created:', data);
                    return fetch(`${import.meta.env.VITE_API_URL}/api/email/send-order-email`, {
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
                    console.error('Error creating Airbnb order:', error);
                  })
                  .finally(() => {
                    setIsProcessingPayment(false);
                  });
                } else {
                  // Eredeti publikus rendelés létrehozás
                  fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                  })
                  .then(response => response.json())
                  .then(data => {
                    return fetch(`${import.meta.env.VITE_API_URL}/api/email/send-order-email`, {
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
                }
              });
            }}
          />
        </PayPalScriptProvider>
      </div>
    ) : (<></>)}

    {isProcessingPayment && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-accent"></div>
      </div>
    )}
  </div>
)
}

export default TotalSummaryWidget
