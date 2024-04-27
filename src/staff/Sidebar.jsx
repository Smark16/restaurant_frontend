import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../App.css'
import './staff.css'

function Sidebar() {
    const location = useLocation()
  return (
    <>
    <div className="containers">
    <ul className='staffSidebar'>
        <li className={location.pathname === '/staff/dashboard' ? "activelink" : ""}>
            <Link to='/staff/dashboard'>DashBoard</Link>
        </li>

        <li  className={location.pathname ==='/staff/dashboard/menu'? "activelink" : ""}>
            <Link to='/staff/dashboard/menu'>Items</Link>
        </li>

        <li  className={location.pathname === '/staff/dashboard/orders' ? "activelink" : ""}>
            <Link to='/staff/dashboard/orders'>Placed Orders</Link>
        </li>

        <li  className={location.pathname === '/staff/dashboard/reservations'? "activelink" : ""}>
            <Link to='/staff/dashboard/reservations'>Reservations</Link>
        </li>

        <li  className={location.pathname === '/staff/dashboard/customers' ? "activelink" : ""}>
            <Link to='/staff/dashboard/customers'>Ratings</Link>
        </li>

        <li  className={location.pathname === '/staff/dashboard/profile' ? "activelink" : ""}>
            <Link to='/staff/dashboard/profile'>Profile</Link>
        </li>

        </ul>

   
  <ul className='Logout'>
        <li>
            <Link to='/staff/dashboard/logout'>Logout</Link>
        </li>
    </ul>
    </div>
    
    </>
  )
}

export default Sidebar
