import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './cust.css';
import useHook from './customhook';

function Notifications() {
 const {showNotifications, user} = useContext(AuthContext)
 const notificationOrderUrl =  `https://restaurant-backend5.onrender.com/restaurant/usermsg/${user.user_id}`
 const {notifyAll, setNotifyAll} = useHook(notificationOrderUrl)

 const orderMsg = async()=>{
  try{
    const response = await axios(notificationOrderUrl)
    const data = response.data
    setNotifyAll(data)
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
      {showNotifications && (
        <div className="notify bg-white p-3">
          <p className='text-primary'>show notifications</p>
          <ul className='ordermsg'>
            {notifyAll.map((notifys) => {
              const { id, message, message_date } = notifys;
              return (
                <li className='d-flex msg' key={id}>
                  <p>{message}</p>
                  <span>{message_date}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}

export default Notifications;
