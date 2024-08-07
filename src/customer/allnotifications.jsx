import React, { useContext} from 'react'

import { AuthContext } from '../Context/AuthContext'
import './cust.css'

function AllNotifications() {
 const {showNotificationsAll, orderNotify} = useContext(AuthContext)
 

  return (
    <>
    {showNotificationsAll && (<>
      <div className="notify bg-white p-3">
    <p className='text-primary'>show notifications</p>
    <ul className='ordermsg'>
      {orderNotify.map(notify =>{
        const {id, message, message_date} = notify
        return (
          <>
          <li className='d-flex msg' key={id}>
        <p>{message}</p>
        <span>{message_date}</span>
      </li>
          </>
        )
      })}
    </ul>
    </div>   
    </>)}
     
    </>
  )
}

export default AllNotifications
