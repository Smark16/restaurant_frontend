import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
// import { AuthContext } from '../Context/AuthContext'
import '../App.css'

function Custbar() {

// const {handleDisplay, display} = useContext(AuthContext)

  return (
   <>
   
   <ul className='sidelists'>

    <li>
        <i class="bi bi-activity"></i>
        <p><Link to='/customer/dashboard'>DashBoard</Link></p>
    </li>

    <li>
       <i class="bi bi-menu-button-wide"></i>
        <p><Link to='/customer/dashboard/customermenuDisplay'>Menu</Link></p>
    </li>

    <li>
        <i class="bi bi-bag-dash-fill"></i>
        <p><Link to='customerOrder'>Order</Link></p>
    </li>

    <li>
       <i class="bi bi-person-circle"></i>
        <p><Link to='CustomerProfile'>Profile</Link></p>
    </li>

    <li>
      <i class="bi bi-life-preserver"></i>
        <p><Link to='CustomerReservation'>Reservation</Link></p>
    </li>

    <li>
       <i class="bi bi-credit-card"></i>
        <p><Link to='CustomerPayment'>Payment</Link></p>
    </li>

    <li>
       <i class="bi bi-box-arrow-right"></i>
        <p><Link to='logout'>Logout</Link></p>
    </li>

   </ul>
   </>
  )
}

export default Custbar
