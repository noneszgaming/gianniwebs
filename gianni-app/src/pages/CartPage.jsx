/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import CartItem from '../components/Item'
import TotalSummaryWidget from '../components/TotalSummaryWidget'
import Widget from '../components/widgets/Widget'
import { useTranslation } from 'react-i18next'

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const { t } = useTranslation();
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    useEffect(() => {
        const handleCartUpdate = () => {
            // Determine cart type from URL
            const isAirbnb = window.location.pathname.includes('/airbnb');
            const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
            
            const items = JSON.parse(localStorage.getItem(cartKey)) || [];
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
                },
                type: item.type || 'food',
                allergenes: item.allergenes || {},
                items: item.items ? item.items.map(subItem => ({
                    ...subItem,
                    name: subItem.name?.en ? subItem.name : {
                        en: subItem.name,
                        hu: subItem.name,
                        de: subItem.name
                    },
                    img: subItem.img || ''
                })) : []
            }));
            
            if (JSON.stringify(cartItems) !== JSON.stringify(transformedItems)) {
                setCartItems(transformedItems);
            }
        };

        handleCartUpdate();
        
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
        
    }, [cartItems.length]);



    return (
        <div className='w-full h-fit grid grid-cols-1 lg:grid-cols-4 gap-x-10 gap-y-14 font-poppins pt-[2%] pb-[4%]' style={{ zIndex: 1 }}>
            {location.pathname === "/airbnb/cart" &&
                <div className='w-full flex md:flex-row flex-col gap-10 lg:col-span-4 col-span-2 '>
                    <Widget type="food"/>
                    <Widget type="merch"/>
                </div>
            }
            <div className="w-full lg:order-2 order-1 col-span-2 lg:col-span-1 flex flex-col gap-10 md:mt-15">
                <TotalSummaryWidget totalPrice={calculateTotal()} />
                {location.pathname === "/cart" &&
                    <Widget type="merch"/>
                }
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
                            id={item.id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            img={item.img}
                            quantity={item.quantity}
                            type={item.type}
                            items={item.items}
                            allergenes={item.allergenes}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default CartPage
