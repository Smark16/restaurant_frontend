import React, { useContext, useState} from 'react'
import { AuthContext } from '../Context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css'
import './staff.css'
const orderUrl = 'http://127.0.0.1:8000/restaurant/orders';
const reservation = 'http://127.0.0.1:8000/restaurant/reservation'
const userUrl = 'http://127.0.0.1:8000/restaurant/users'
const latestOrder = 'http://127.0.0.1:8000/restaurant/latest_orders'

import useHook from './customHook';


function Staff() {
    const {orders, loading, Revenue, reservations, avg, customer, latest} = useHook(orderUrl, reservation, userUrl, latestOrder)
    const {user} = useContext(AuthContext)

    // getting meal by its price
    const expenseByMeal = latest.reduce((item, transaction) =>{
        const {menu_price, menu_name} = transaction
        console.log(menu_price, menu_name)
        if(!item[menu_name]){
          item[menu_name] = 0
        }
        item[menu_name] += parseFloat(menu_price)
        return item
    }, {})


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
                <div className="words">
                    <h4>UGX.{Revenue}</h4>
                    <p>Total Revenue</p>
                </div>
            </div>
        </li>

        <li>
            <div className="item">
                <div className="icon">
                <i class="bi bi-bag cons"></i>
                </div>
                <div className="words">
                    <h4>{latest.length}</h4>
                    <p>Today Order</p>
                </div>
            </div>
        </li>

        <li>
            <div className="item">
                <div className="icon">
                <i class="bi bi-wallet2 cons"></i>
                </div>
                <div className="words">
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
                <div className="words">
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
                {orders.slice(0, 6).map(tdata =>{
                    const {id, contact, location, status, user, order_date} = tdata
                    return (
                        <>
                            <tr key={id}>
                    <td scope='col'>{user}</td>
                    <td scope='col'>{order_date}</td>
                    <td scope='col'>{location}</td>
                    <td scope='col'>{contact}</td>
                    <td scope='col' className='text-success'>{status}</td>
                        </tr>            
                        </>
                    )
                })}
            </tbody>
           </table>
         </div>
         
         <div className="reservations">
           <h4>Reservations</h4>
           <table className='table table-striped table-hover'>
            <thead>
                <tr>
                    <th scope='col'>Name</th>
                    <th scope='col'>Contact</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Table</th>
                    <th scope='col'>Date</th>
                    <th scope='col'>Party Size</th>
                    <th scope='col'>requests</th>
                </tr>
            </thead>

            <tbody>
            {reservations.slice(0, 6).map(tdata =>{
                    const {id, contact, user,email, party_size, table, reservation_date, status} = tdata
                    return (
                        <>
                            <tr key={id}>
                    <td scope='col'>{user}</td>
                    <td scope='col'>{contact}</td>
                    <td scope='col'>{email}</td>
                    <td scope='col'>{table}</td>
                    <td scope='col'>{reservation_date}</td>
                    <td scope='col'>{party_size}</td>
                    <td scope='col'  className='text-success'>{status}</td>
                        </tr>            
                        </>
                    )
                })}

            </tbody>
           </table>
         </div>
       </div>

       <div className="col-md-4 col-sm-12">
          <h4>Orders Today</h4>
          {latest.map(latest_order=>{
            const {id, menu_name, image} = latest_order
            const avg_revenue = expenseByMeal[menu_name]
            return (
                <>
                 <div className="todayOrders" key={id}>
            <div className='orderItem'>
                <div className="icon">
                <img src={image}/>
                </div>
                <div className="words">
                    <h4>shs.{avg_revenue}</h4>
                    <p>Total Revenue</p>
                </div>
            </div>

            <div className='quantity'>
             <span>{menu_name}</span>
            </div>
            </div>
                </>
            )
          })}
       </div>
    </div>
    </>
   
  )
}

export default Staff