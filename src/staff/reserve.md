  const filteredOrders = data.filter(order => {
        const orderDay = new Date(order.order_date).toLocaleDateString();
        console.log(orderDay, currentDay)
        return orderDay === currentDay;
    });
    
useEffect(()=>{
        fetchData()

        const intervalId = setInterval(() => {
            const newDay = new Date().toLocaleDateString();
            if (newDay !== currentDay) {
                setCurrentDay(newDay);
                setRevenue(0);
            }
        }, 1000 * 60 * 60 * 24); // Check every 24 hours for a new day

        return () => clearInterval(intervalId);
    }, [currentDay])

    const handleCart = (id) => {
  const selectedItem = food.find((item) => item.id === id);
  const existingItemIndex = addItem.findIndex((item) => item[0].id === id);

  if (existingItemIndex !== -1) {
    const updatedCart = [...addItem];
    updatedCart[existingItemIndex][1] += 1;
    setAddItem(updatedCart);
  } else {
    setAddItem([...addItem, [selectedItem, 1]]);
  }

  const updatedItemString = JSON.stringify(addItem);
  localStorage.setItem('clickedItem', updatedItemString);
};

const get = localStorage.getItem('clickedItem')
console.log(get);