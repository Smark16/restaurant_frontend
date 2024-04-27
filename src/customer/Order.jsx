import React, { useEffect, useState } from 'react'
const orderPlaced = 'http://127.0.0.1:8000/restaurant/orders'
import './cust.css'
import axios from 'axios'

function Order() {
const [loading, setLoading] = useState(false)
const [orders, setOrders] = useState([])
  const fetchData = async()=>{
    try{
      setLoading(true)
      const response = await axios(orderPlaced)
      const data = response.data
      setOrders(data)
      setLoading(false)
    }catch (err){
      console.log("Error occured")
    }
  }

  useEffect(()=>{
  fetchData()
  }, [])

  const handleDelete = async (id)=>{
    try{
   
      axios.delete(`http://127.0.0.1:8000/restaurant/delete_order/${id}`)

      const deleted = orders.filter(order => order.id !== id)
      setOrders(deleted)
    }catch (err){

    }

  }

  return (
    <>
    <h4 className='text-center text-white bg-success p-2'>CheckOut Your Placed Orders</h4>

    {loading ? (<div className='text-center'>
          <span className="loader"></span>
        </div>) : (
          <>
              <table className='table'>
     <tr>
      <th>#</th>
      <th>Username</th>
      <th>Location</th>
      <th>Contact</th>
      <th>Status</th>
      <th>Order Date</th>
      <th>Actions</th>
     </tr>

     <tbody>
        {orders.map(order =>{
          const {id, user, location, contact, status,  order_date} = order
          return (
            <>
            <tr key={id}>
            <td>{id}</td>
           <td>{user}</td>
           <td>{location}</td>
           <td>{contact}</td>
           <td>{status}</td>
           <td>{order_date}</td>
           <td><button className='text-white text-center bg-danger' onClick={()=>handleDelete(id)}>Delete</button></td>
            </tr>
            </>
          )
        })}
     </tbody>
    </table>
          </>
        )}

      
    </>
  )
}

export default Order