import { useEffect, useState } from 'react';
import MerchWidgetItem from './MerchWidgetItem'
import { useTranslation } from 'react-i18next';

const MerchWidget = () => {
  const [merchItems, setMerchItems] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMerchItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/merch');
        const data = await response.json();
        setMerchItems(data);
      } catch (error) {
        console.log('Error fetching merch items:', error);
      }
    };

    fetchMerchItems();
  }, []);

  return (
    <div className='w-full h-[550px] flex flex-col justify-start items-center bg-slate-600 font-poppins rounded-[26px] shadow-black/50 shadow-2xl duration-500 pt-8 gap-2'>
        <h2 className='text-2xl font-bold text-center text-light'>
            {t("merches")}
        </h2>

        <div className='w-full flex flex-col justify-start items-center px-4 overflow-auto mb-6'>
          {merchItems.map((item) => (
            <MerchWidgetItem
              id = {item._id}
              key={item._id}
              name={item.name}
              price={item.price}
              img={item.img}
            />
          ))}
        </div>
    </div>
  )
}

export default MerchWidget
