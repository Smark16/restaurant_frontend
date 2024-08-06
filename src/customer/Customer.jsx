import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import order from '../Images/order.png';
import reserve from '../Images/reser.png';
// import Chart from "react-apexcharts";
import Calendar from './calendar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './cust.css';

function Customer() {
  const { user, Loginloading } = useContext(AuthContext);
  const [expense, setExpense] = useState(0);
  const user_order = `https://restaurant-backend5.onrender.com/restaurant/user_order/${user.user_id}`;
  const [Userorder, setUserOrder] = useState([]);
  const userOrder = `https://restaurant-backend5.onrender.com/restaurant/userOrder/${user.user_id}`;
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const orderPlaced = `https://restaurant-backend5.onrender.com/restaurant/userOrder/${user.user_id}`;
  const userReservation = `https://restaurant-backend5.onrender.com/restaurant/user-reservation/${user.user_id}`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(orderPlaced);
      const data = response.data;
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.log("Error occurred");
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(userReservation);
      const data = response.data;
      setReservations(data);
      setLoading(false);
    } catch (err) {
      console.log("Error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchReservations();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(user_order);
      const data = response.data;
      setUserOrder(data)
      // Calculate total expense
      const totalExpense = data.reduce((total, order) => {
        const orderTotal = order.menu.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return total + orderTotal;
      }, 0);

      setExpense(totalExpense);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      {Loginloading ? (
        <>
          <div className="shape-loader"></div>
          <div className='shape-overlay'></div>
        </>
      ) : (
        <>
          <div className="mainsection">
            <h4 className='text-center bg-success text-white p-3 menubar'>Welcome, {user.username}</h4>

            <div className="result mt-2">
              <div className="order">
                <div className="icon">
                  <img src={reserve} alt="" className='cons' />
                </div>

                <div className="word">
                  <p className='text-black'>Total Reservations</p>
                  <h4 className='text-black'>{reservations.length}</h4>
                </div>
              </div>

              <div className="order">
                <div className="icon">
                  <i className="bi bi-bar-chart-line-fill cons"></i>
                </div>

                <div className="word">
                  <p>Total Expense</p>
                  <h4>UGX {expense.toFixed(2)}</h4>
                </div>
              </div>

              <div className="order">
                <div className="icon">
                  <img src={order} alt="" className='cons' />
                </div>

                <div className="word">
                  <p>Total Order</p>
                  <h4>{Userorder.length}</h4>
                </div>
              </div>

              <div className="order">
                <div className="icon">
                  <i className="bi bi-wallet cons"></i>
                </div>

                <div className="word">
                  <p>Wallet</p>
                  <h4>UGX 0.00</h4>
                </div>
              </div>
            </div>

            <div className="more">
              <div className="graph bg-white p-2 mt-2">
                {/* <Chart options={options} series={series} type="line" width="300" /> */}
                <div className="orders">
                  <p className='text-center text-primary'>Made Orders</p>
                  {loading ? (
                    <span className='loader'></span>
                  ) : orders.length === 0 ? (
                    <p className='alert alert-info text-center'>No Activities!!!</p>
                  ) : (
                    <table className='table table-striped table-hover'>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Username</th>
                          <th>Location</th>
                          <th>Contact</th>
                          <th>Status</th>
                          <th>Order Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 3).map(order => {
                          const { id, location, contact, status, order_date } = order;
                          return (
                            <tr key={id}>
                              <td>{id}</td>
                              <td>{order.user.username}</td>
                              <td>{location}</td>
                              <td>{contact}</td>
                              <td>
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
                                    <i className="bi bi-arrow-counterclockwise"></i> In Progress
                                  </span>
                                )}
                              </td>
                              <td>{order_date}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  <p className='text-primary seeAll'><Link to='/customer/dashboard/customerOrder'>See All <i className="bi bi-arrow-right-circle-fill"></i></Link></p>
                </div>

                <div className="reservation mt-3">
                  <p className='text-primary text-center'>Made Reservations</p>
                  {loading ? (
                    <span className='loader'></span>
                  ) : reservations.length === 0 ? (
                    <p className='alert alert-info text-center'>No Reservations!!!</p>
                  ) : (
                    <table className='table table-striped table-hover'>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Username</th>
                          <th>Table</th>
                          <th>contact</th>
                          <th>party size</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.slice(0, 3).map(reservation => {
                          const { id, table, contact, party_size, status } = reservation;
                          return (
                            <tr key={id}>
                              <td>{id}</td>
                              <td>{reservation.user.username}</td>
                              <td>{table}</td>
                              <td>{contact}</td>
                              <td>{party_size}</td>
                              <td>
                                {status === 'Accepted' && (
                                  <span className='text-success'>
                                    Confirmed
                                  </span>
                                )}
                                {status === 'Rejected' && (
                                  <span className='text-danger'>
                                    Canceled
                                  </span>
                                )}
                                {status === 'Pending' && (
                                  <span className='text-warning'>
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                
                </div>
              </div>

              <div className="detail bg-white">
                <div className="calendar">
                  <Calendar />
                </div>
                <h4 className='text-center'>Product Details</h4>
                <ul className='list'>
                  <li className='d-flex'>
                    <span>Completed Orders</span>
                    <h6 className='text-white bg-success p-2'>23</h6>
                  </li>

                  <li className='d-flex'>
                    <span>Reservation Status</span>
                    <h6 className='text-white bg-primary p-2'>Pending</h6>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Customer;
