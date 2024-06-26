import React, { useContext, useEffect, useState} from 'react'
import { AuthContext } from '../Context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css'
import './staff.css'
const orderUrl = 'https://restaurant-backend-5.onrender.com/restaurant/orders';
const reservation = 'https://restaurant-backend-5.onrender.com/restaurant/reservation'
const userUrl = 'https://restaurant-backend-5.onrender.com/restaurant/users'
const latestOrder = 'https://restaurant-backend-5.onrender.com/restaurant/latest_orders'

import useHook from './customHook';


function Staff() {
    const {orders, loading, reservations,customer, latest} = useHook(orderUrl, reservation, userUrl, latestOrder)
    console.log('latest', latest)
    const {user} = useContext(AuthContext)
    const [Revenue, setRevenue] = useState(0)
    const [avg , setAvg] = useState(0)

    const fetchOrderItems = async()=>{
        try{
         const response = await axios(orderItems)
         const data = response.data
         const amount = data.map(cash => cash.menu.reduce((total, item)=> total + item.price, 0)).reduce((total, order) => total + order, 0).toFixed(2)
         setRevenue(amount)
      
         const avg_rev = amount / data.length
         setAvg(avg_rev)
        }catch(err){
          console.log('there was an error')
        }
      }

      useEffect(()=>{
        fetchOrderItems()
      },[])

    // getting meal by its price
    const expenseByMeal = latest.reduce((item, transaction) =>{
        const {menu_price, menu_name} = transaction
        const total_price = parseFloat(menu_price)
        console.log(menu_price, menu_name)
        if(!item[menu_name]){
          item[menu_name] = 0
        }
        item[menu_name] += parseFloat(total_price)
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
                <div className="word">
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
                <div className="word">
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

{/* orders today */}
       <div className="col-md-4 col-sm-12">
          <h4>Orders Today</h4>
          {Object.keys(expenseByMeal).map(latest_order=>{
            return (
                <>
                 <div className="todayOrders" key={latest_order}>
            <div className='orderItem'>
                {/* <div className="icon">
                <img src={image}/>
                </div> */}
                {/* <div className="words">
                    <h4>shs.{expenseByMeal[latest_order].toFixed(2)}</h4>
                    <p>Total Revenue</p>
                </div> */}
            </div>

            <div className='quantity'>
             <span>{latest_order}</span>
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
