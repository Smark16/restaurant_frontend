import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
const notificationOrderUrl = 'https://restaurant-backend-5.onrender.com/restaurant/messages'
import { AuthContext } from '../Context/AuthContext'
import './cust.css'

function AllNotifications() {
 const [orderNotify, setOrderNotify] = useState([])
 const {showNotificationsAll} = useContext(AuthContext)
 
 const orderMsg = async()=>{
  try{
    const response = await axios(notificationOrderUrl)
    const data = response.data
    setOrderNotify(data)
    console.log(data)

  }catch(err){
    console.log('There was an error')
  }
 }


 useEffect(()=>{
  orderMsg()
 }, [])
  return (
    <>
    {showNotificationsAll && (<>
      <div className="notify bg-white p-3">
    <p className='text-primary'>show notifications</p>
    <ul className='ordermsg'>
      {orderNotify.map(notify =>{
        const {id, message, message_date} = notify
        return (
          <>
          <li className='d-flex msg' key={id}>
        <p>{message}</p>
        <span>{message_date}</span>
      </li>
          </>
        )
      })}
    </ul>
    </div>   
    </>)}
     
    </>
  )
}

export default AllNotifications
