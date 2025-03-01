/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import WidgetItem from './WidgetItem';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Widget = ({ type = 'merch' }) => {
  const [items, setItems] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const { t } = useTranslation();
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Use the appropriate API endpoint based on type
        const endpoint = type === 'food' ? 'food' : 'merch';
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${endpoint}`);
        const data = await response.json();
        
        // Filter items by the requested type
        const filteredItems = data.filter(item => item.type === type);
        setItems(filteredItems);
      } catch (error) {
        console.log(`Error fetching ${type} items:`, error);
      }
    };

    fetchItems();
  }, [type]);

  useEffect(() => {
    // Auto rotate through items every 3 seconds if not hovering
    if (items.length > 1 && !isHovering) {
      intervalRef.current = setInterval(() => {
        setCurrentItemIndex(prev => (prev + 1) % items.length);
      }, 3000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [items.length, isHovering]); // Add isHovering to dependencies

  const nextItem = () => {
    setCurrentItemIndex(prev => (prev + 1) % items.length);
    resetInterval();
  };

  const prevItem = () => {
    setCurrentItemIndex(prev => (prev - 1 + items.length) % items.length);
    resetInterval();
  };

  const resetInterval = () => {
    clearInterval(intervalRef.current);
    
    if (items.length > 1 && !isHovering) {
      intervalRef.current = setInterval(() => {
        setCurrentItemIndex(prev => (prev + 1) % items.length);
      }, 4000);
    }
  };

  const handleDotClick = (index) => {
    setCurrentItemIndex(index);
    resetInterval();
  };

  // Handle mouse enter and leave events
  const handleMouseEnter = () => {
    setIsHovering(true);
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    resetInterval();
  };

  // Display titles based on item type
  const getTitle = () => {
    if (type === 'food') return t("foods");
    return t("merches");
  }

  return (
    <div className={`w-full h-[500px] sm:h-[450px] md:h-[400px] flex flex-col justify-start items-center font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 pt-8 gap-2 overflow-hidden ${type === "merch" ? 'bg-slate-600' : 'bg-zinc-500'}`}>
      <h2 className='text-2xl font-bold text-center text-light'>
        {getTitle()}
      </h2>

      <div className='relative w-full h-[85%] px-4'>
        {items.length > 0 && (
          <>
            <div 
              className='h-full w-full overflow-hidden'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className='flex transition-transform duration-500 ease-in-out h-full'
                style={{ transform: `translateX(-${currentItemIndex * 100}%)` }}
              >
                {items.map((item) => (
                  <div key={item.id} className='w-full flex-shrink-0'>
                    <WidgetItem
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      img={item.img}
                      type={type}
                      allergenes={item.allergenes}
                    />
                  </div>
                ))}
              </div>
            </div>

            {items.length > 1 && (
              <>
                <button
                  onClick={prevItem}
                  className='absolute left-6 -top-7 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-accent transition-colors cursor-pointer z-10 duration-500 border border-accent'
                >
                  <FaChevronLeft className='text-black' />
                </button>
                
                <button
                  onClick={nextItem}
                  className='absolute right-6 -top-7 transform -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-accent transition-colors cursor-pointer z-10 duration-500 border border-accent'
                >
                  <FaChevronRight className='text-black' />
                </button>
                
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {items.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full cursor-pointer transition-all duration-500 ${
                        currentItemIndex === index
                          ? 'w-8 bg-primary relative overflow-hidden'
                          : 'w-3 bg-accent/70'
                      }`}
                      onClick={() => handleDotClick(index)}
                    >
                      {currentItemIndex === index && (
                        <div
                          className="absolute top-0 left-0 h-full bg-accent/80"
                          style={{
                            width: '100%',
                            animation: isHovering ? 'none' : 'progressAnimation 3s linear forwards'
                          }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Widget;
