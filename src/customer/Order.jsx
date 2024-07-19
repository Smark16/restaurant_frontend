import React, { useContext, useEffect, useState } from 'react'
import './cust.css'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext'
import norder from '../Images/noorder.jpg'

function Order() {
const [loading, setLoading] = useState(false)
const [orders, setOrders] = useState([])
const {user} = useContext(AuthContext)
const orderPlaced = `https://restaurant-backend5.onrender.com/restaurant/userOrder/${user.user_id}`
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
   
      axios.delete(`https://restaurant-backend5.onrender.com/restaurant/delete_order/${id}`)

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
          <div className="table_container">
          <table className='table table-striped table-hover'>
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
          const {id, location, contact, status,  order_date} = order
          return (
            <>
            <tr key={id}>
            <td>{id}</td>
           <td>{order.user.username}</td>
           <td>{location}</td>
           <td>{contact}</td>
           <td>
           {status === 'Completed' && (
                    <span className='text-success d-flex'>
                      <i class="bi bi-check2-circle"></i> completed
                    </span>
                  )}
                  {status === 'Canceled' && (
                    <span className='text-danger'>
                      canceled
                    </span>
                  )}
                  {status === 'In Progress' && (
                    <span className='text-warning d-flex'>
                      <i class="bi bi-arrow-counterclockwise"></i> pending
                    </span>
                  )}
            </td>
           <td>{order_date}</td>
           <td><button className='text-white text-center bg-danger' onClick={()=>handleDelete(id)}>Delete</button></td>
            </tr>
            </>
          )
        })}
     </tbody>
    </table>
          </div>
           
          </>)}
             
          </>
        )}

      
    </>
  )
}

export default Order
