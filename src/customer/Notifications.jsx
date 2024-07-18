import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './cust.css';

function Notifications() {
 const [orderNotify, setOrderNotify] = useState([])
 const {showNotifications, setShowNotifications, user} = useContext(AuthContext)
 const notificationOrderUrl =  `http://127.0.0.1:8000/restaurant/usermsg/${user.user_id}`

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
