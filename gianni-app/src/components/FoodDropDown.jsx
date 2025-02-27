const FoodDropDown = ({ onFoodsSelected, initialSelectedIds = [] }) => {
    const { t, i18n } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedFoodItems, setSelectedFoodItems] = useState({});
    const [foods, setFoods] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [initialIdsProcessed, setInitialIdsProcessed] = useState(false);

    // Fetch foods csak egyszer fut le
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                console.log('Fetching foods...');
                const token = localStorage.getItem('adminToken');
                
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/items`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const availableFoods = data
                        .filter(item => item.type === 'food' && item.available)
                        .map(food => ({
                            ...food,
                            uniqueId: food._id
                        }));
                    
                    setFoods(availableFoods);
                } else {
                    console.error('Invalid response format:', data);
                    setFoods([]);
                }
            } catch (error) {
                console.error('Error fetching foods:', error);
                setFoods([]);
            }
        };
        
        fetchFoods();
    }, []);

    // Az initialSelectedIds és foods változások összekapcsolása egyetlen useEffect-be
    useEffect(() => {
        if (foods.length > 0 && !initialIdsProcessed) {
            console.log('Processing initial selected IDs:', initialSelectedIds);
            
            // Állítsuk be az alapértelmezett értéket: minden elem false
            const newState = {};
            foods.forEach(food => {
                newState[food._id] = false;
            });
            
            // Állítsuk be a kiválasztott elemeket true-ra
            if (initialSelectedIds && initialSelectedIds.length > 0) {
                initialSelectedIds.forEach(selectedId => {
                    foods.forEach(food => {
                        const foodId = String(food._id);
                        const selectedIdStr = String(selectedId);
                        
                        if (foodId === selectedIdStr || 
                            String(food.id) === selectedIdStr || 
                            String(food.uniqueId) === selectedIdStr) {
                            console.log('Marking selected:', food.name.en);
                            newState[food._id] = true;
                        }
                    });
                });
            }
            
            console.log('Setting selection state:', newState);
            setSelectedFoodItems(newState);
            setIsInitialized(true);
            setInitialIdsProcessed(true);
        }
    }, [foods, initialSelectedIds, initialIdsProcessed]);

    // Szülő komponens értesítése a kiválasztott elemekről
    useEffect(() => {
        if (!isInitialized) return;
        
        const selectedIds = Object.entries(selectedFoodItems)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => id)
            .filter(id => id);

        console.log('Notifying parent of selected IDs:', selectedIds);
        if (onFoodsSelected) {
            onFoodsSelected(selectedIds);
        }
    }, [selectedFoodItems, onFoodsSelected, isInitialized]);

    const selectedFoodItemsCount = Object.values(selectedFoodItems).filter(Boolean).length;

    return (
        <div className='w-[80%] mb-4 relative select-none'>
            <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-full p-2 border border-accent rounded-lg flex justify-between items-center cursor-pointer'
            >
                <span>
                    {selectedFoodItemsCount
                        ? `Food Selected (${selectedFoodItemsCount})`
                        : 'Select Foods'
                    }
                </span>
                <IoIosArrowDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isDropdownOpen && (
                <div className='absolute top-full left-0 w-full max-h-60 bg-white border border-accent rounded-lg mt-1 p-2 z-10 overflow-y-auto'>
                    {foods.length === 0 ? (
                        <div className="py-2 text-center text-gray-500">No food items available</div>
                    ) : (
                        foods.map((foodItem) => {
                            const itemId = foodItem._id;
                            return (
                                <FoodDropDownItem
                                    key={itemId}
                                    foodItemKey={itemId}
                                    name={foodItem.name[i18n.language] || foodItem.name.en}
                                    isChecked={Boolean(selectedFoodItems[itemId])}
                                    onCheckChange={(newValue) => {
                                        console.log('Changing:', itemId, 'to', newValue);
                                        setSelectedFoodItems(prev => ({
                                            ...prev,
                                            [itemId]: newValue
                                        }));
                                    }}
                                />
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};
