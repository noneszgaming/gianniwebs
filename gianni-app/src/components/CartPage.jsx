
const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const { t } = useTranslation();
   
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    useEffect(() => {
        const handleCartUpdate = () => {
            const items = JSON.parse(localStorage.getItem('cart')) || [];
            // Transform items to maintain original translation objects
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
            }));
            setCartItems(transformedItems);
        };

        handleCartUpdate();
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // Rest of your component remains the same
};
