import React, { useContext, useEffect, useRef, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

import { AuthContext } from '../Context/AuthContext';

const orderUrl = 'http://127.0.0.1:8000/restaurant/orders';

function App() {
  const { user, setNotifyAll, notifyAll } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [madeOrder, setMadeOrder] = useState([]);
  const [usermadeItems, setUserMadeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios(orderUrl);
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

  const socketRef = useRef(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://restaurant-backend5.onrender.com/restaurant/delete_order/${id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (err) {
      console.log("There was an error");
    }
  };

  const changeStatus = async (id, user_id, username, newStatus) => {
    setUserId(user_id);
    try {
      await axios.patch(`https://restaurant-backend5.onrender.com/restaurant/update_status/${id}`, { newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
      // Ensure the WebSocket connection is open before sending a message
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          'message': `Dear ${username}, your Order is ${newStatus}`,
          'user': user_id
        }));
      }
    } catch (err) {
      console.log("There was an error changing the status");
    }
  };

  useEffect(() => {
    
    const url = `ws://127.0.0.1:8000/ws/customer/11/`;
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = function (e) {
      console.log('WebSocket connection established');
    };

    socket.onclose = function (e) {
      console.log('WebSocket connection closed');
    };

    socket.onmessage = function (e) {
      let data = JSON.parse(e.data);
      console.log(data);
      setNotifyAll(prevNotify => [...prevNotify, data]);
      
      if (data.type === 'notification') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification('Restaurant Management System', {
              body: `${data.message}`,
            });
          }
        });
      }
    };

    return () => {
      socket.close();
    };
  }, []); 

  const showOrder = async (id, user_id) => {
    setShowModal(true);
    const madeOrdersUrl = `https://restaurant-backend5.onrender.com/restaurant/user_order/${user_id}`;

    try {
      setLoading(true);
      const response = await axios.get(madeOrdersUrl);
      const data = response.data;
      setMadeOrder(data);

      const userItems = data.find(order => order.order.id === id);
      setUserMadeItems(userItems.menu);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false); // Ensure loading is set to false even on error
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      $('#myTable').DataTable();
    }
  }, [orders]);

  return (
    <div className='order_table res_container'>
      <table border="2" id="myTable" className='table myTable table-striped table-hover'>
        <thead>
          <tr>
            <th scope='col'>User_Name</th>
            <th scope='col'>Date</th>
            <th scope='col'>Location</th>
            <th scope='col'>Contact</th>
            <th scope='col'>Status</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderStatus && (<h4 className='text-center mt-3'>No Orders Available</h4>)}
          {orders.map(order => {
            const { id, contact, location, order_date, status } = order;
            return (
              <tr key={id}>
                <td scope='col'>{order.user.username}</td>
                <td scope='col'>{order_date}</td>
                <td scope='col'>{location}</td>
                <td scope='col'>{contact}</td>
                <td scope='col'>
                  {status === 'Completed' && (
                    <span className='text-success d-flex'>
                      <i className="bi bi-check2-circle"></i> Completed
                    </span>
                  )}
                  {status === 'Canceled' && (
                    <span className='text-danger'>
                      Canceled
                    </span>
                  )}
                  {status === 'In Progress' && (
                    <span className='text-warning d-flex'>
                      <i className="bi bi-arrow-counterclockwise"></i> Pending
                    </span>
                  )}
                  {!status && (
                    <span className='text-secondary'>
                      <i className="fa fa-spinner"></i> Waiting
                    </span>
                  )}
                </td>
                <td>
                  <div className="actions d-flex">
                    <i className="bi bi-trash-fill" onClick={() => handleDelete(id)}></i>
                    <i className="bi bi-eye" onClick={() => showOrder(id, order.user.id)}></i>
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
                            onClick={() => changeStatus(id, order.user.id, order.user.username, 'Completed')}
                          >
                            Completed
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => changeStatus(id, order.user.id, order.user.username, 'Canceled')}
                          >
                            Canceled
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => changeStatus(id, order.user.id, order.user.username, 'Pending')}
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

      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="custom-modal-header">
              <h5 className="custom-modal-title">View The Orders</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>
                &times;
              </button>
            </div>
            <div className="custom-modal-body">
              {loading ? (
                <p>Loading...</p>
              ) : (
                usermadeItems.map(item => {
                  const { image, price, name, quantity } = item;
                  return (
                    <div key={item.id} className="order-item">
                      <img src={`https://restaurant-backend5.onrender.com${image}`} alt={name} className='modalImg'/>
                      <div className="item-details">
                        <h5>{name}</h5>
                        <p>{quantity}</p>
                        <p>Price: {price}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
