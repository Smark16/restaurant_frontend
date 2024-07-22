import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import './cust.css';
import moment from 'moment';
import useHook from './customhook';

function Notifications() {
  const { showNotifications, user } = useContext(AuthContext);
  const notificationOrderUrl = `https://restaurant-backend5.onrender.com/restaurant/usermsg/${user.user_id}`;
  const { notifyAll, setNotifyAll } = useHook(notificationOrderUrl);

  const orderMsg = async () => {
    try {
      const response = await axios(notificationOrderUrl);
      const data = response.data;
      setNotifyAll(data);
    } catch (err) {
      console.log('There was an error');
    }
  };

  useEffect(() => {
    orderMsg();
  }, []);

  return (
    <>
      {showNotifications && (
        <div className="notify bg-white p-3">
          <p className='text-primary'>Show Notifications</p>
          <ul className='ordermsg'>
            {notifyAll.map((notifys) => {
              const { id, message, message_date } = notifys;
              // Format the message_date using moment
              const relativeDate = moment(message_date).fromNow();

              return (
                <li className='d-flex msg' key={id}>
                  <div>
                  <p>{message}</p>
                  <span>{relativeDate}</span>
                  </div>
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
