import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext'
import useHook from './customhook';

const tables = 'https://restaurant-backend-5.onrender.com/restaurant/tables'
const newReservation = 'https://restaurant-backend-5.onrender.com/restaurant/new_reservation'

function Reservations() {
const {user, showSuccessAlert, showErrorAlert} = useContext(AuthContext)
const [reservation, setReservation] = useState({contact:"", Email:"" ,party_size:"", table:"", reservation_date:""})
const [table, setTable] = useState([])
const [result, setResult] = useState('')
const [reserve, setReserve] = useState('')
const [confirmed, setConfirmed] = useState(false)
const notificationOrderUrl =  `https://restaurant-backend-5.onrender.com/restaurant/usermsg/${user.user_id}`
const {orderNotify, setOrderNotify} = useHook(notificationOrderUrl)
const navigate = useNavigate()


const fetchTables = async ()=>{
  try{
     const response = await axios(tables)
     const data = response.data
     setTable(data)
  }catch(err){
    console.log("No table")
  }
}

const handleTable =(e)=>{
  const tableNo = e.target.value
  setReservation({...reservation, table:tableNo})
}

// Handle Notifications
let url = 'wss://restaurant-backend-5.onrender.com/ws/socket-server/';
const socket = new WebSocket(url);
useEffect(() => {
  
  socket.onmessage = function (e) {
    let data = JSON.parse(e.data);
    console.log(data)
    setOrderNotify([...orderNotify, data])
    if(data.type === 'notification') {
      console.log(data.message)
    // Notification.requestPermission()
    // .then(perm =>{
    // if(perm === 'granted'){
    // new Notification(`order from ${user.username}`, {
    //   body:`${data.message}`,
    //       })
    //    }
    //   })
      }   
  };
 
}, []);

const handleSubmit = (e)=>{

e.preventDefault()
const formData = new FormData()
formData.append("user", user.user_id)
formData.append("contact", reservation.contact)
formData.append("email", reservation.Email)
formData.append("party_size", reservation.party_size)
formData.append("table", reservation.table)
formData.append("reservation_date", reservation.reservation_date)

axios.post(newReservation, formData)
.then(res =>{
  if(res.status === 200){
    setResult(res.data.response)
  }else if(res.status === 201){
    setReserve(res.data.response)
    setResult('')
    setReservation({contact:"", Email:"" ,party_size:"", table:"", reservation_date:""})
    showSuccessAlert("Reservation Made Successfully")
    setConfirmed(true)
    navigate("/customer/dashboard")
  }else{
    showErrorAlert("Please fill in all Details")
    setConfirmed(false)
  }
 
}).catch (err =>{
  console.log("An error occured", err)
  setConfirmed(false)
})

socket.send(JSON.stringify({
  'message': `${user.username} has made a reservation`,
  'user':`${user.user_id}`
}))
}
console.log(result)
useEffect(()=>{
  fetchTables()
}, [])
  const handleChange = (e)=>{
    const {name, value} = e.target
    setReservation({...reservation, [name]:value})
  }
  return (
    <>
      <h2 className='text-center bg-success text-white p-2'>Make Your reservation</h2>

      <h5>{reserve}</h5>

      <form onSubmit={handleSubmit}>
      <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Contact
    </label>
    <input
      type="number"
      className="form-control"
      id="formGroupExampleInput"
      placeholder="Contact"
      required
      name='contact'
      value={reservation.contact}
      onChange={handleChange}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Email
    </label>
    <input
      type="email"
      className="form-control"
      id="formGroupExampleInput"
      placeholder="Email"
      required
      name='Email'
      value={reservation.Email}
      onChange={handleChange}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Party Size
    </label>
    <input
      type="number"
      className="form-control"
      id="formGroupExampleInput"
      placeholder="Party_Size"
      required
      name='party_size'
      value={reservation.party_size}
      onChange={handleChange}
    />
  </div>

  <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Table
    </label>
    <select onChange={handleTable}>
      <option>Choose Table</option>
       {table.map(tb =>{
        const {id, table_no} = tb
        return(
          <>
          <option value={id}>Table: {table_no}</option>
          </>
        )
       })}
    </select>

    <span className='text-danger'>{result}</span>

  </div>

  <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Reservation Date
    </label>
    <input
      type="date"
      className="form-control"
      id="formGroupExampleInput"
      placeholder="Reservation Date"
      required
      name='reservation_date'
      value={reservation.reservation_date}
      onChange={handleChange}
    />
  </div>

  <div className='text-center'>
    <button className='bg-primary text-white' type='submit'>
      {confirmed ? (<>
      Confirming...
      </>) : (<>
        Confirm Reservation
      </>)}
      </button>
  </div>
      </form>
    </>
 
  )
}

export default Reservations
