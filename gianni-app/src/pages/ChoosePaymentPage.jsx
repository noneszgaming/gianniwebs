/* eslint-disable no-unused-vars */
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const ChoosePaymentPage = () => {
  const initialOptions = {
    clientId: "AUugzFtEnv8l8EOE0knHrxPMSL7G6ESl4Asw7_uJ_tC9UpvcUe06nNH12oyeV8l5e__eW0Df5pe5wmfL",
    currency: "HUF",
    intent: "capture",
  };

  const handlePaymentSuccess = (details) => {
    console.log("Sikeres fizetés!", details);
    // Itt kezelheted a sikeres fizetést
  };

  return (
    <div className='w-full h-full flex justify-evenly items-center font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
      <div className='w-[25%] flex flex-col justify-center items-center gap-10 bg-blue-500 p-10 rounded-xl'>
        <h2 className='text-[34px] text-light text-center font-bold mb-10 select-none'>PayPal</h2>
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            className='w-[100%] h-[100%]'
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: "100.00", // Az összeg amit fizetni kell
                    },
                  },
                ],
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(handlePaymentSuccess);
            }}
          />
        </PayPalScriptProvider>
      </div>
    </div>
  );
};

export default ChoosePaymentPage;
