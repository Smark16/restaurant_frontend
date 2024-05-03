import React, { useContext, useEffect, useState } from 'react'
import './cust.css'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext'
import norder from '../Images/noorder.jpg'

function Order() {
const [loading, setLoading] = useState(false)
const [orders, setOrders] = useState([])
const {user} = useContext(AuthContext)
const orderPlaced = `http://127.0.0.1:8000/restaurant/userOrder/${user.user_id}`
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
          {orders.length === 0 ? (<>
          <h5 className='text-center'>NO ORDERS PLACED YET</h5>
          <img src={norder} alt='no order' className='text-center norder_img'></img>
          </>) : (<>
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
          </>)}
             
          </>
        )}

      
    </>
  )
}

export default Order