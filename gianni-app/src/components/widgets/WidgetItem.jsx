/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import AmountCounter from '../AmountCounter';
import { cartCount } from '../../signals';
import { LanguageContext } from '../../context/LanguageContext';
import PrimaryBtn from '../buttons/PrimaryBtn';
import { useTranslation } from 'react-i18next';
import AllergenDropDown from '../AllergenDropDown';

const WidgetItem = ({ name, price, img, id, description, type = 'merch', allergenes }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedAllergenes, setSelectedAllergenes] = useState(allergenes || {});
    const { language } = useContext(LanguageContext);
    const { t } = useTranslation();

    // Use provided description or fallback to default descriptions
    const itemDescription = description || {
        hu: type === 'food' ? "Étel" : "Merch termék",
        en: type === 'food' ? "Food item" : "Merch item",
        de: type === 'food' ? "Lebensmittel" : "Merch Artikel"
    };

    const handleAddToCart = () => {
        const isAirbnb = window.location.pathname.includes('/airbnb');
        const cartKey = isAirbnb ? 'cart_airbnb' : 'cart_public';
        
        const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const existingItemIndex = existingCart.findIndex(item => item.id === id);
        
        if (existingItemIndex !== -1) {
            existingCart[existingItemIndex].quantity += selectedQuantity;
            // Update allergenes if needed
            if (type === 'food') {
                existingCart[existingItemIndex].allergenes = selectedAllergenes;
            }
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
                    de: description.de,
                },
                price: parseInt(price),
                img,
                quantity: parseInt(selectedQuantity),
                type: type
            };
            
            // Add allergenes for food items
            if (type === 'food') {
                newItem.allergenes = selectedAllergenes;
            }
            
            existingCart.push(newItem);
        }
        
        localStorage.setItem(cartKey, JSON.stringify(existingCart));
        cartCount.value = existingCart.reduce((sum, item) => sum + item.quantity, 0);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className='w-full h-full flex flex-col sm:flex-row justify-evenly items-center bg-light font-poppins rounded-[26px] p-3 sm:p-4 transition-all duration-300 overflow-y-visible'>
            {/* Image section */}
            <div className='w-full sm:w-[40%] lg:w-[40%] mb-2 sm:mb-0 flex justify-center items-center'>
                <img
                    className='aspect-square w-full max-w-[140px] xs:max-w-[160px] sm:max-w-[160px] lg:max-w-[200px] object-cover rounded-[26px] bg-amber-200 shadow-md transition-all duration-300'
                    src={img}
                    alt={name[language]}
                />
            </div>
            
            {/* Content section */}
            <div className='w-full sm:w-[55%] lg:w-[47%] h-full flex flex-col justify-center py-1 sm:py-4 sm:pl-2 overflow-y-visible'>
                {/* Title and description */}
                <div className='mb-2 sm:mb-0'>
                    <h2 className='text-lg sm:text-xl font-bold mb-1 sm:mb-2 line-clamp-2'>
                        {name[language]}
                    </h2>
                    <p className='text-xs sm:text-sm text-gray-700 mb-2 sm:mb-4 line-clamp-2 sm:line-clamp-3 md:line-clamp-4'>
                        {itemDescription[language]}
                    </p>
                </div>
                
                {/* Controls section */}
                <div className='flex flex-col gap-2 sm:gap-4 overflow-y-visible'>
                    <div className='w-full flex justify-between items-center'>
                        <AmountCounter onQuantityChange={setSelectedQuantity} />
                        <p className='text-base sm:text-lg md:text-[20px] font-semibold'>{price} Ft</p>
                    </div>
                    
                    {/* Show allergen dropdown only for food items */}
                    {type === 'food' && (
                        <AllergenDropDown
                            className="w-full mb-1"
                            onAllergenChange={(allergenes) => setSelectedAllergenes(allergenes)}
                        />
                    )}
                    
                    <PrimaryBtn
                        onClick={handleAddToCart}
                        text={t("primaryBtn.addToCart")}
                    />
                </div>
            </div>
        </div>
    );
};

export default WidgetItem;
