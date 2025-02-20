/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import CartItem from '../components/Item'
import TotalSummaryWidget from '../components/TotalSummaryWidget'
import MerchWidget from '../components/merch/MerchWidget'
import { useTranslation } from 'react-i18next'

const CartPage = () => {
    const [cartItems, setCartItems] = useState([])
    const { t } = useTranslation()
   
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    useEffect(() => {
        const handleCartUpdate = () => {
            const items = JSON.parse(localStorage.getItem('cart')) || []
            const transformedItems = items.map(item => ({
                ...item,
                name: item.name?.en ? item.name : {
                    en: item.name,
                    hu: item.name,
                    de: item.name
                },
                description: item.description?.en ? item.description : {
                    en: item.description,
                    hu: item.description,
                    de: item.description
                }
            }))
            setCartItems(transformedItems)
        }

        handleCartUpdate()
        window.addEventListener('cartUpdated', handleCartUpdate)
        return () => window.removeEventListener('cartUpdated', handleCartUpdate)
    }, [])

    return (
        <div className='w-full h-fit grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-14 font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
            <div className="w-full lg:order-2 order-1 col-span-2 lg:col-span-1 flex flex-col gap-10 md:mt-15">
                <TotalSummaryWidget totalPrice={calculateTotal()} />
                <MerchWidget />
            </div>

            <div className="w-full flex flex-col items-center lg:order-1 order-2 col-span-2 lg:col-span-3">
                <h1 className="text-3xl text-center font-bold mb-6">{t("cart")}</h1>
                {cartItems.length === 0 ? (
                    <div className="text-center text-2xl font-bold py-10">
                        {t("emptyCart")}
                    </div>
                ) : (
                    cartItems.map((item, index) => (
                        <CartItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            img={item.img}
                            quantity={item.quantity}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default CartPage
