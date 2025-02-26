/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from 'react'
import { LanguageContext } from '../context/LanguageContext'
import PrimaryBtn from './buttons/PrimaryBtn'
import AmountCounter from './AmountCounter'
import { useTranslation } from 'react-i18next'
import { cartCount } from '../signals'
import AllergenDropDown from './AllergenDropDown'
import BoxCardItem from './BoxCardItem'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import img1 from '../images/burger.jpg'
import img2 from '../images/pizza.jpg'
import img3 from '../images/salad.jpg'
import img4 from '../images/gyros.jpg'
import img5 from '../images/hotdog.jpg'
  const BoxCard = ({ name, description, price, img, id }) => {
      const { t } = useTranslation()
      const { language } = useContext(LanguageContext)
      const [selectedQuantity, setSelectedQuantity] = useState(1)
      const [currentImageIndex, setCurrentImageIndex] = useState(0)
      const images = [
            img1,
            img2,
            img3,
            img4,
            img5
      ]
      
      const intervalRef = useRef(null);
    
      const nextImage = () => {
          setCurrentImageIndex((prev) => (prev + 1) % images.length);
          if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = setInterval(() => {
                  setCurrentImageIndex((prev) => (prev + 1) % images.length);
              }, 3000);
          }
      };

        const prevImage = () => {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
        }, []);

        const handleAddToCart = () => {
          const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
          const existingItemIndex = existingCart.findIndex(item => item.id === id);
        
          if (existingItemIndex !== -1) {
              existingCart[existingItemIndex].quantity += selectedQuantity;
          } else {
              const newItem = {
                  id,
                  name: {
                      hu: name.hu,
                      en: name.en,
                      de: name.de
                  },
                  description: {
                      hu: description.hu,
                      en: description.en,
                      de: description.de
                  },
                  price,
                  img,
                  quantity: selectedQuantity,
              };
              existingCart.push(newItem);
          }
        
          localStorage.setItem('cart', JSON.stringify(existingCart));
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
               
                  <button
                      onClick={prevImage}
                      className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors'
                  >
                      <FaChevronLeft className='text-black' />
                  </button>
               
                  <button
                      onClick={nextImage}
                      className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors'
                  >
                      <FaChevronRight className='text-black' />
                  </button>
                
                  {/* Image indicators */}
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
                                  if (intervalRef.current) {
                                      clearInterval(intervalRef.current);
                                      intervalRef.current = setInterval(() => {
                                          setCurrentImageIndex((prev) => (prev + 1) % images.length);
                                      }, 3000);
                                  }
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
                      Meat Box
                      {/* {name[language]} */}
                  </h2>
                  <p className='text-sm'>
                      You got only four of them!
                      {/* {description[language]} */}
                  </p>
                  <div className='flex justify-between items-center w-full py-3'>
                      <p className='text-[22px] font-bold'>{price} Ft</p>
                      <AmountCounter onQuantityChange={setSelectedQuantity} />
                  </div>

                  <div className='w-full h-fit grid grid-cols-2 gap-2 pb-2'>
                      <div className='flex flex-col gap-2'>
                          <BoxCardItem name="Soup"/>
                          <BoxCardItem name="Soup"/>
                          <BoxCardItem name="Soup"/>
                          <BoxCardItem name="Soup"/>
                      </div>
                      <div className='flex flex-col gap-2'>
                          <BoxCardItem name="Soup"/>
                          <BoxCardItem name="Soup"/>
                          <BoxCardItem name="Soup"/>
                          <BoxCardItem name="Soup"/>
                      </div>
                  </div>

                  <AllergenDropDown />

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