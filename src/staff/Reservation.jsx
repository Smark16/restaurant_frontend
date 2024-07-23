import React, { useContext, useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { AuthContext } from '../Context/AuthContext';
import useHook from '../customer/customhook';

const reservationUrl = 'https://restaurant-backend5.onrender.com/restaurant/reservation';

function Reservation() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState(true);
  const notificationOrderUrl = `https://restaurant-backend5.onrender.com/restaurant/usermsg/${user.user_id}`;
  const { notifyAll, setNotifyAll } = useHook(notificationOrderUrl);
  const socketRef = useRef(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://restaurant-backend5.onrender.com/restaurant/reservation/${id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (err) {
      console.log("There was an error:", err);
    }
  };

  // Handle Notifications
  useEffect(() => {
    const url = `wss://restaurant-backend5.onrender.com/ws/socket-server/${user.user_id}/`;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = function(e) {
      console.log('WebSocket connection established');
    };

    socket.onclose = function(e) {
      console.log('WebSocket connection closed');
    };

    socket.onmessage = function(e) {
      let data = JSON.parse(e.data);
      console.log(data);  // Ensure this logs data when the message event is triggered
      setNotifyAll(prevNotify => [...prevNotify, data]);

      if (data.type === 'notification' && data.user.user_id !== user.user_id) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification('Restaurant management System', {
              body: `${data.message}`,
            });
          }
        });
      }
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      socket.close();
    };
  }, []);

  const changeStatus = async (id,user_id, username, newStatus) => {
    const formData = new FormData();
    formData.append("newStatus", newStatus);
    
    try {
      const response = await axios.patch(`https://restaurant-backend5.onrender.com/restaurant/update_reservation/${id}`, formData);
      console.log(response);
      setOrders((prevOrders) => 
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
      localStorage.setItem(`status_${id}`, newStatus);
    } catch (err) {
      console.log("There was an error changing the status:", err);
    }

    socketRef.current.send(JSON.stringify({
      'message': `Dear ${username}, your reservation is ${newStatus}`,
      'user': user_id
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(reservationUrl);
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        const result = response.data;
        setOrders(result);
        setOrderStatus(result.length === 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    if (orders.length > 0) {
      $('#myTable').DataTable();
    }
  }, [orders]);

  return (
    <div className='res_container'>
      <table border="2" id="myTable" className="table table-striped table-hover">
        <thead>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>Contact</th>
            <th scope='col'>Table</th>
            <th scope='col'>Date</th>
            <th scope='col'>Party_size</th>
            <th scope='col'>Requests</th>
            <th scope='col'>Status</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderStatus && (<h4 className='text-center mt-3'>No Orders Available</h4>)}
          {orders.map(order => {
            const { id, contact,party_size, table, reservation_date, status } = order;
            return (
              <tr key={id}>
                <td scope='col'>{order.user.username}</td>
                <td scope='col'>{contact}</td>
                <td scope='col'>{table}</td>
                <td scope='col'>{reservation_date}</td>
                <td scope='col'>{party_size}</td>
                <td scope='col'>{order.requests}</td>
                <td scope='col'>
                  {status === 'Accepted' && (<span className='text-success d-flex'><i className="bi bi-check2-circle"></i> Accepted</span>)}
                  {status === 'Rejected' && (<span className='text-danger'>Rejected</span>)}
                  {status === 'Pending' && (<span className='text-warning d-flex'><i className="bi bi-arrow-counterclockwise"></i> Pending</span>)}
                  {status === '' && (<span className='text-secondary'><i className="fa fa-spinner"></i> Waiting</span>)}
                </td>
                <td>
                  <div className="actions d-flex">
                    <i className="bi bi-trash-fill" onClick={() => handleDelete(id)}></i>
                    <div className="dropdown">
                      <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Change Status
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => changeStatus(id,order.user.id,order.user.username, 'Accepted')}
                          >
                            Accepted
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => changeStatus(id,order.user.id,order.user.username, 'Rejected')}
                          >
                            Rejected
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => changeStatus(id,order.user.id,order.user.username, 'Pending')}
                          >
                            Pending
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Reservation;
