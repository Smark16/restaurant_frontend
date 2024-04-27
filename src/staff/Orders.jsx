import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import 'datatables.net';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const orderUrl = 'http://127.0.0.1:8000/restaurant/orders';

function App() {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState(true);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/restaurant/delete_order/${id}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
    } catch (err) {
      console.log("there was an err");
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/restaurant/update_status/${id}`, { newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.log("There was an error changing the status");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios(orderUrl);
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        const result = response.data;
        console.log(result);
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
            <th scope='col'>User_Name</th>
            <th scope='col'>Date</th>
            <th scope='col'>Location</th>
            <th scope='col'>contact</th>
            <th scope='col'>status</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orderStatus && (<h4 className='text-center mt-3'>No Orders Available</h4>)}
          {orders.map(order => {
            const { id, contact, location, order_date, status, user } = order;
            return (
              <tr key={id}>
                <td scope='col'>{user}</td>
                <td scope='col'>{order_date}</td>
                <td scope='col'>{location}</td>
                <td scope='col'>{contact}</td>
                <td scope='col'>
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
                  {status === 'Pending' && (
                    <span className='text-warning d-flex'>
                      <i class="bi bi-arrow-counterclockwise"></i> pending
                    </span>
                  )}
                  {!status && (
                    <span className='text-secondary'>
                      <i class="fa fa-spinner"></i> waiting
                    </span>
                  )}
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
                            onClick={() => changeStatus(id, 'Completed')}
                          >
                            Completed
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => changeStatus(id, 'Canceled')}
                          >
                            Canceled
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

export default App;
