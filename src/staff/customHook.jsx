import React, {useEffect, useState} from 'react'
import axios from 'axios';
const orderUrl = 'https://restaurant-backend-5.onrender.com/restaurant/orders';
const reservation = 'https://restaurant-backend-5.onrender.com/restaurant/reservation'
const userUrl = 'https://restaurant-backend-5.onrender.com/restaurant/users'
const foodUrl = 'https://restaurant-backend-5.onrender.com/restaurant/food_items'
const latestOrder = 'https://restaurant-backend-5.onrender.com/restaurant/latest_orders'
const orderItems = 'https://restaurant-backend-5.onrender.com/restaurant/order_items'


function useHook() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [Revenue, setRevenue] = useState(0)
    const [reservations, setReservations] = useState([])
    const [avg , setAvg] = useState(0)
    const [customer, setCustomer] = useState([])
    const [food, setFood] = useState([])
    const [latest, setLatest] = useState([])

    const fetchOrders = async ()=>{
        try{
            setLoading(true)
            const response = await axios(orderUrl)
            const data = response.data
            setOrders(data)
            setLoading(false)
          
        } catch (err){
            console.log(err)
        }
        
      }

const fetchOrderItems = async()=>{
  try{
   const response = await axios(orderItems)
   const data = response.data
   const amount = data.map(cash => cash.menu.reduce((total, item)=> total + item.price, 0)).reduce((total, order) => total + order, 0).toFixed(2)
   setRevenue(amount)

   const avg_rev = amount / data.length
   setAvg(avg_rev)
  }catch(err){
    console.log('there was an error')
  }
}

    const fetchReservations = async ()=>{
        try{
         setLoading(true)
         const response = await axios(reservation)
         const data = response.data
         setReservations(data)
         setLoading(false)
        }catch (err){
            console.log(err)
        }
    }

    const FetchCustomers = async ()=>{
        try{
        const response = await axios (userUrl)
        const data = response.data
        const customers = data.filter(user => user.is_customer === true)
        setCustomer(customers)
        }catch (err){
            console.log(err)
        }
    }

    const fetchFood = async ()=>{
        try{
          setLoading(true)
          const response = await axios(foodUrl)
          const data = response.data
          setFood(data)
          setLoading(false)
        }catch (error){
          console.log(error)
        }
    }

  const Latest = async ()=>{
     try{
       const response = await axios(latestOrder)
       const data = response.data
       setLatest(data)
     }catch(err){
      console.log(err)
     }
  } 

      useEffect(()=>{
        fetchOrders()
        fetchReservations()
        FetchCustomers()
        fetchFood()
        Latest()
        fetchOrderItems()

        if(customer.length > 2){
            return '0' + customer
        }

        if(latest.length > 2){
          return '0' + customer
      }
      }, [])
  return (
{orders, loading, Revenue, reservations, avg, customer, food, latest}
  )
}

export default useHook
