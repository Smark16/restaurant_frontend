import Dexie from 'dexie'
import useAxios from './useAxios'

const db = new Dexie('Product_Detail')
db.version(1).stores({
    Item : 'id, category ,descriptions, name, price, image, is_available, ingredients'
})

const db2 = new Dexie('User_Orders')
db2.version(2).stores({
    Order : 'id, user ,order_date ,order_time ,contact ,location ,payment_method ,Tracking_Id ,status'
})

export function IndexedData(){
 const axiosInstance = useAxios()
    
// cache single item
const getSingleItem = async (id)=>{
    try{
     const response = await axiosInstance.get(`http://127.0.0.1:8000/restaurant/food_items/${id}`)
     const data = response.data

     await db.Item.put({
        id:data.id,
        category:data.category,
        name:data.name,
        price:data.price,
        image:data.image,
        is_available:data.is_available,
        ingredients:data.ingredients
     })

     return data
    }catch(err){
        console.log('err', err)

        const storedItem = await db.Item.get(Number(id))
        if(storedItem){
            return storedItem
        }

        throw new Error(`Product ${id} un available offline`)
    }
}

// cache user orders
const getUserOrders = async(user_id)=>{
   try{
    const response = await axiosInstance.get(`http://127.0.0.1:8000/orders/userOrder/${user_id}`)
    const data = response.data

    // Validate API response
    if (!data || !Array.isArray(data)) {
        throw new Error('Invalid API response: Expected an array of orders');
      }

      // Store each order in IndexedDB
      await Promise.all(
        data.map(order =>
          db2.Order.put({
            id:order.id,
            user: user_id,
            order_date: order.order_date,
            order_time: order.order_time,
            contact: order.contact,
            location: order.location,
            payment_method: order.payment_method,
            tracking_id: order.Tracking_Id, // Adjusted to lowercase for consistency
            status: order.status
          })
        )
      );

      return data;
   }catch(err){
    console.log('cached order err', err)
     // Fetch cached orders for the specific user
     const cachedOrders = await db2.Order.where('user').equals(user_id).toArray();

     if (cachedOrders.length > 0) {
       console.log('Retrieved cached orders:', cachedOrders);
       return cachedOrders;
     }

     throw new Error(`No orders found for user ${user_id} (offline)`);
   }
}
    return {
        getSingleItem, getUserOrders 
    }
}

