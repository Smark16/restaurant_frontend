import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import './staff.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import useHook from './customHook';

const orderItemsUrl = 'https://restaurant-backend5.onrender.com/restaurant/order_items';
const tablesUrl = 'https://restaurant-backend5.onrender.com/restaurant/tables';
const postTableUrl = 'https://restaurant-backend5.onrender.com/restaurant/post_table';
const patchTableStatusUrl = 'https://restaurant-backend5.onrender.com/restaurant/table_status/';

function Staff() {
    const { orders, loading, reservations, customer, latest, Revenue, avg } = useHook();
    const { user } = useContext(AuthContext);
    const [tables, setTables] = useState([]);
    const [revenue, setRevenue] = useState(0);
    const [average, setAverage] = useState(0);
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState('');
    const [newTable, setNewTable] = useState({ table_no: "", is_booked: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTable({ ...newTable, [name]: value });
    };
    console.log(newTable);

    const handleTable = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("table_no", newTable.table_no);
        formData.append("is_booked", newTable.is_booked);

        try {
            const res = await axios.post(postTableUrl, formData);
            console.log(res);
            if (res.status === 200) {
                setMessage("New Table Has Been Added");
            } else {
                setMessage("Failed to add table");
            }
        } catch (err) {
            console.error('Error response:', err.response);
            setMessage("Failed to add table");
        }
    };

    const changeStatus = async (id, currentStatus) => {
        const newStatus = !currentStatus;

        try {
            await axios.patch(`${patchTableStatusUrl}${id}`, { is_booked: newStatus });
            setTables((prevTables) =>
                prevTables.map((table) =>
                    table.id === id ? { ...table, is_booked: newStatus } : table
                )
            );
        } catch (err) {
            console.error('Error response:', err.response);
        }
    };

    const fetchTables = async () => {
        try {
            const response = await axios.get(tablesUrl);
            const data = response.data;
            setTables(data);
        } catch (err) {
            console.log("No table");
        }
    };

    const fetchOrderItems = async () => {
        try {
            const response = await axios.get(orderItemsUrl);
            const data = response.data;
            const amount = data.map(cash => cash.menu.reduce((total, item) => total + item.price, 0)).reduce((total, order) => total + order, 0).toFixed(2);
            setRevenue(amount);

            const avg_rev = amount / data.length;
            setAverage(avg_rev);
        } catch (err) {
            console.log('there was an error');
        }
    };

    useEffect(() => {
        fetchOrderItems();
        fetchTables();
    }, []);

    const expenseByMeal = latest.reduce((item, transaction) => {
        const { menu_price, menu_name } = transaction;
        const total_price = parseFloat(menu_price);
        if (!item[menu_name]) {
            item[menu_name] = 0;
        }
        item[menu_name] += parseFloat(total_price);
        return item;
    }, {});

    return (
        <>
            <div className='bg-success text-center text-white p-3 mt-0 greet'>
                <h2>Welcome, <span>{user.username}</span></h2>
            </div>

            <ul className='d-flex items'>
                <li>
                    <div className="item">
                        <div className="icon">
                            <i className="bi bi-bar-chart-line-fill cons"></i>
                        </div>
                        <div className="word">
                            <h4>UGX.{Revenue}</h4>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                </li>

                <li>
                    <div className="item">
                        <div className="icon">
                            <i className="bi bi-bag cons"></i>
                        </div>
                        <div className="word">
                            <h4>{latest.length}</h4>
                            <p>Today Order</p>
                        </div>
                    </div>
                </li>

                <li>
                    <div className="item">
                        <div className="icon">
                            <i className="bi bi-wallet2 cons"></i>
                        </div>
                        <div className="word">
                            <h4>{customer.length}</h4>
                            <p>Customers</p>
                        </div>
                    </div>
                </li>

                <li>
                    <div className="item">
                        <div className="icon">
                            <i className="bi bi-bar-chart-line-fill cons"></i>
                        </div>
                        <div className="word">
                            <h4>UGX.{avg.toFixed(2)}</h4>
                            <p>Average Revenue</p>
                        </div>
                    </div>
                </li>
            </ul>

            <div className="row adminviews">
                <div className="col-md-8 col-sm-12">
                    <div className="orderlists">
                        <h4>Order Lists</h4>
                        <table className='table table-striped table-hover'>
                            <thead>
                                <tr>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Date</th>
                                    <th scope='col'>Location</th>
                                    <th scope='col'>contact</th>
                                    <th scope='col'>status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.slice(0, 6).map(tdata => {
                                    const { id, contact, location, status, user, order_date } = tdata;
                                    return (
                                        <tr key={id}>
                                            <td scope='col'>{user.username}</td>
                                            <td scope='col'>{order_date}</td>
                                            <td scope='col'>{location}</td>
                                            <td scope='col'>{contact}</td>
                                            <td scope='col' className='text-success'>{status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <p className='text-primary seeAll'><Link to='/staff/dashboard/orders'>see All <i className="bi bi-arrow-right-circle-fill"></i></Link></p>
                    </div>

                    <div className="reservations">
                        <h4>Reservations</h4>
                        <table className='table table-striped table-hover'>
                            <thead>
                                <tr>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Contact</th>
                                    <th scope='col'>Table</th>
                                    <th scope='col'>Date</th>
                                    <th scope='col'>Party Size</th>
                                    <th scope='col'>requests</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reservations.slice(0, 6).map(tdata => {
                                    const { id, contact, party_size, table, reservation_date, status } = tdata;
                                    return (
                                        <tr key={id}>
                                            <td scope='col'>{tdata.user.username}</td>
                                            <td scope='col'>{contact}</td>
                                            <td scope='col'>{table}</td>
                                            <td scope='col'>{reservation_date}</td>
                                            <td scope='col'>{party_size}</td>
                                            <td scope='col' className='text-success'>{status}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <p className='text-primary seeAll'><Link to='/staff/dashboard/reservations'>see All <i className="bi bi-arrow-right-circle-fill"></i></Link></p>
                    </div>
                </div>

                {/* orders today */}
                <div className="col-md-4 col-sm-12">
                    <div className="mange d-flex">
                    <h4>Manage Tables</h4>
                        <button className='btn btn-primary' onClick={() => setShowModal(true)}>Add table</button>
                    </div>
                    <div className="tables">
                        <ul>
                            {tables.map(tble => {
                                const { id, table_no, is_booked } = tble;
                                return (
                                    <li key={id} className='alert alert-info d-flex'>
                                        <span>Table {table_no}</span>
                                        <div className="tbl_info d-flex">
                                            <p className={is_booked ? 'text-danger' : 'text-primary'}>
                                                {is_booked ? 'taken' : 'free'}
                                            </p>
                                            <input
                                                type='checkbox'
                                                checked={is_booked}
                                                onChange={() => changeStatus(id, is_booked)}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Custom Modal */}
            {showModal && (
                <div className="custom-modal-overlay">
                    <div className="custom-modal">
                        <div className="custom-modal-header">
                            <h5 className="custom-modal-title">Add Table</h5>
                            <button type="button" className="close" onClick={() => setShowModal(false)}>
                                &times;
                            </button>
                        </div>
                        <div className="custom-modal-body">
                            <form onSubmit={handleTable}>
                                <div className="mb-3">
                                    <label htmlFor="table_no" className="form-label">Table Number</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="table_no"
                                        name='table_no'
                                        value={newTable.table_no}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">
                                    {status ? 'Adding...' : 'Add table'}
                                </button>
                                {message && <div className="alert alert-info mt-3">{message}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Staff;
