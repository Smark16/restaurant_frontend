import React, { useContext, useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthContext } from '../Context/AuthContext';

const reservation = 'https://restaurant-backend-5.onrender.com/restaurant/reservation'

function Reservation() {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState(true);
  const { orderNotify, setOrderNotify } = useContext(AuthContext);

  const handleDelete = async (id)=>{
    try{
      await axios.delete(`https://restaurant-backend-5.onrender.com/restaurant/reservation/${id}`)
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (err) {
      console.log("There was an error:", err);
    }
  };

  // Handle Notifications
  let url = 'wss://restaurant-backend-5.onrender.com/ws/socket-server/';
  const socket = new WebSocket(url);

  useEffect(() => {
    socket.onmessage = function (e) {
      let data = JSON.parse(e.data);
      console.log(data);
      setOrderNotify([...orderNotify, data]);
      if (data.type === 'notification') {
        console.log(data.message);
      }
    };

    return () => {
      socket.close(); // Clean up WebSocket connection when component unmounts
    };
  }, [orderNotify, setOrderNotify]);

  const changeStatus = async (id, newStatus) => {
    const formData = new FormData()
    formData.append("newStatus", newStatus)
    setMystatus(newStatus)
    try {
      const response = await axios.patch(`https://restaurant-backend-5.onrender.com/restaurant/update_reservation/${id}`, formData)
      console.log(response)
      localStorage.setItem(`status_${id}`, newStatus);
  
    } catch (err) {
      console.log("There was an error changing the status:", err);
    }
    socket.send(JSON.stringify({
      'message': `Dear customer, your reservation is ${newStatus}`,
      'user': id // Assuming `id` is the user id here
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(reservation);
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
    <div>
      <table border="2" id="myTable" className='table myTable table-striped table-hover'>
        <thead>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>Contact</th>
            <th scope='col'>Email</th>
            <th scope='col'>Table</th>
            <th scope='col'>Date</th>
            <th scope='col'>Party_size</th>
            <th scope='col'>Requests</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderStatus && (<h4 className='text-center mt-3'>No Orders Available</h4>)}
          {orders.map(order => {
            const { id, user, contact, email, party_size, table, reservation_date, status } = order;
            return (
              <tr key={id}>
                <td scope='col'>{user}</td>
                <td scope='col'>{contact}</td>
                <td scope='col'>{email}</td>
                <td scope='col'>{table}</td>
                <td scope='col'>{reservation_date}</td>
                <td scope='col'>{party_size}</td>
                <td scope='col'>
                  {status === 'Accepted' && (<span className='text-success d-flex'><i class="bi bi-check2-circle"></i> Accepted</span>)}
                  {status === 'Rejected' && (<span className='text-danger'>Rejected</span>)}
                  {status === 'Pending' && (<span className='text-warning d-flex'><i class="bi bi-arrow-counterclockwise"></i> pending</span>)}
                  {status === '' && (<span className='text-secondary'><i class="fa fa-spinner"></i> waiting</span>)}
                </td>
                <td>
                  <div className="actions d-flex">
                    <i class="bi bi-trash-fill" onClick={() => handleDelete(id)}></i>
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
                            onClick={() => changeStatus(id, 'Accepted')}
                          >
                            Accepted
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => changeStatus(id, 'Rejected')}
                          >
                            Rejected
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => changeStatus(id, 'Pending')}
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
