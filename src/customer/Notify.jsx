import React, {useContext, useEffect} from 'react'
import { AuthContext } from '../Context/AuthContext';
import './cust.css';
import axios from 'axios';
function Notify() {
    const { showNotifications, notifyAll, setNotifyAll, user } = useContext(AuthContext);

  const orderMsg = async () => {
    try {
      const response = await axios.get(`https://restaurant-backend5.onrender.com/restaurant/usermsg/${user.user_id}`);
      const data = response.data;
      setNotifyAll(data);
    } catch (err) {
      console.log('There was an error', err);
    }
  };

  useEffect(() => {
    if (user) {
      orderMsg();
    }
  }, [user]);
  return (
    <div>
       <div className="p-3 bg-white">
          <p className='text-primary text-center'>show notifications</p>
          <ul className='mt-2'>
            {notifyAll.map((notifys) => {
              const { id, message, message_date } = notifys;
              return (
                <li className='d-flex not_list' key={id}>
                  <p className='not_msg'>{message}</p>
                  <span className='not_date'>{message_date}</span>
                </li>
              );
            })}
          </ul>
        </div>
    </div>
  )
}

export default Notify
