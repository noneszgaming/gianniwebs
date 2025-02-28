/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import PrimaryBtn from './buttons/PrimaryBtn'
import AmountCounter from './AmountCounter'
import { useTranslation } from 'react-i18next'
import { cartCount, storeType } from '../signals'
import AllergenDropDown from './AllergenDropDown'
import BoxCardItem from './BoxCardItem'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const BoxCard = ({ name, description, price, img, id, items }) => {
    const { t } = useTranslation()
    const { language } = useContext(LanguageContext)
    const [selectedQuantity, setSelectedQuantity] = useState(1)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedAllergenes, setSelectedAllergenes] = useState({})
   
    // Use items' images if available, otherwise use placeholder
    const images = items && items.length > 0
        ? items.map(item => item.img)
        : [img || ''] // Fallback to provided img or empty string
   
    const intervalRef = useRef(null);
 
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
        resetInterval();
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        resetInterval();
    };

    const resetInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % images.length);
            }, 3000);
        }
    };

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [images.length]);

    const handleAddToCart = () => {
        const cartKey = `cart_${storeType.value}`;
        const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
       
        // Compare both id and items array (if exists)
        const existingItemIndex = existingCart.findIndex(item => {
            const idMatch = item.id === id;
            // If both have items arrays, compare them
            if (items && item.items) {
                const itemsMatch = JSON.stringify(item.items) === JSON.stringify(items);
                return idMatch && itemsMatch;
            }
            return idMatch;
        });
   
        if (existingItemIndex !== -1) {
            existingCart[existingItemIndex].quantity += selectedQuantity;
            // Frissítsük az allergéneket
            existingCart[existingItemIndex].allergenes = selectedAllergenes;
        } else {
            // Make sure to save the COMPLETE items array with all properties
            const boxItems = items ? items.map(item => ({
                id: item._id || item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                img: item.img, // Most importantly, include the image for each item
                type: item.type
            })) : [];
           
            const newItem = {
                id,
                name,
                description,
                price,
                img,
                quantity: selectedQuantity,
                type: 'box', // Explicitly set type to 'box'
                items: boxItems, // Store the complete items array
                allergenes: selectedAllergenes // Allergének mentése
            };
            existingCart.push(newItem);
        }
   
        localStorage.setItem(cartKey, JSON.stringify(existingCart));
        cartCount.value = existingCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className='hover:scale-[110%] w-[300px] min-h-[560px] h-fit flex flex-col gap-4 items-center bg-light font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 overflow-y-visible pb-5'>
            <div className='relative w-full'>
                <div className='overflow-hidden rounded-[26px]'>
                    <div
                        className='flex transition-transform duration-500 ease-in-out'
                        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    >
                        {images.map((image, index) => (
                            <img
                                key={index}
                                className='w-full aspect-square object-cover flex-shrink-0 bg-amber-200'
                                src={image}
                                alt=""
                            />
                        ))}
                    </div>
                </div>
             
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors cursor-pointer'
                        >
                            <FaChevronLeft className='text-black' />
                        </button>
                     
                        <button
                            onClick={nextImage}
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors cursor-pointer'
                        >
                            <FaChevronRight className='text-black' />
                        </button>
                    </>
                )}
             
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full cursor-pointer transition-all duration-500 ${
                                currentImageIndex === index
                                    ? 'w-8 bg-primary relative overflow-hidden'
                                    : 'w-3 bg-white/70'
                            }`}
                            onClick={() => {
                                setCurrentImageIndex(index);
                                resetInterval();
                            }}
                        >
                            {currentImageIndex === index && (
                                <div
                                    className="absolute top-0 left-0 h-full bg-white/80"
                                    style={{
                                        width: '100%',
                                        animation: 'progressAnimation 3s linear forwards'
                                    }}
                                ></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-[90%] h-[40%] flex flex-col justify-center items-start'>
                <h2 className='text-2xl font-bold text-center'>
                    {name[language]}
                </h2>
                <p className='text-sm'>
                    {description[language]}
                </p>
                <div className='flex justify-between items-center w-full py-3'>
                    <p className='text-[22px] font-bold'>{price} Ft</p>
                    <AmountCounter onQuantityChange={setSelectedQuantity} />
                </div>

                {items && items.length > 0 && (
                    <div className='w-full h-fit grid grid-cols-2 gap-2 pb-2'>
                        <div className='flex flex-col gap-2'>
                            {items.slice(0, Math.ceil(items.length/2)).map((item, index) => (
                                <BoxCardItem key={index} name={item.name[language]} />
                            ))}
                        </div>
                        <div className='flex flex-col gap-2'>
                            {items.slice(Math.ceil(items.length/2)).map((item, index) => (
                                <BoxCardItem key={index} name={item.name[language]} />
                            ))}
                        </div>
                    </div>
                )}

                <AllergenDropDown 
                    className="w-full"
                    onAllergenChange={(allergenes) => setSelectedAllergenes(allergenes)}
                />

                <PrimaryBtn
                    text={t("primaryBtn.addToCart")}
                    className='w-[80%] text-lg self-center'
                    onClick={handleAddToCart}
                />
            </div>
        </div>
    )
}

export default BoxCard
