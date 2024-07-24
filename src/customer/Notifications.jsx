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
  const [loading, setLoading] = useState(false);

  const orderMsg = async () => {
    try {
      setLoading(true);
      const response = await axios.get(notificationOrderUrl); // Use axios.get for GET requests
      const data = response.data;
      setNotifyAll(data);
    } catch (err) {
      console.error('There was an error fetching notifications', err);
    } finally {
      setLoading(false); // Ensure loading is set to false regardless of success or failure
    }
  };

  useEffect(() => {
    if (user) {
      orderMsg();
    }
  }, [user]); // Dependency array includes user to refetch if user changes

  if (!showNotifications) {
    return null; // Return null if notifications should not be shown
  }

  return (
    <div className="notify bg-white p-3">
      <p className='text-primary'>Show Notifications</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className='ordermsg'>
          {notifyAll.length > 0 ? (
            notifyAll.map((notifys) => {
              const { id, message, message_date } = notifys;
              // Format the message_date using moment
              // const relativeDate = moment(message_date).fromNow();

              return (
                <li className='d-flex msg' key={id}>
                  <div>
                    <p>{message}</p>
                    {/* <span>{relativeDate}</span> */}
                  </div>
                  <span>{message_date}</span>
                </li>
              );
            })
          ) : (
            <p className='text-black'>No notifications available</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
