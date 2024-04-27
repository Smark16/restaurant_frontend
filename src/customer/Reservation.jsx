import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext'
const tables = 'http://127.0.0.1:8000/restaurant/tables'
const newReservation = 'http://127.0.0.1:8000/restaurant/new_reservation'

function Reservations() {
const {user} = useContext(AuthContext)
const [reservation, setReservation] = useState({contact:"", Email:"" ,party_size:"", table:"", reservation_date:""})
const [table, setTable] = useState([])
const [result, setResult] = useState('')
const [reserve, setReserve] = useState('')

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
let url = 'ws://127.0.0.1:8000/ws/socket-server/';
const socket = new WebSocket(url);
useEffect(() => {
  
  socket.onmessage = function (e) {
    let data = JSON.parse(e.data);
    console.log(data)
    if(data.type === 'notification') {
      console.log(data.message)
    Notification.requestPermission()
    .then(perm =>{
    if(perm === 'granted'){
    new Notification(`order from ${user.username}`, {
      body:`${data.message}`,
          })
       }
      })
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
  }
 
}).catch (err =>{
  console.log("An error occured", err)
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
      name='reservation_date'
      value={reservation.reservation_date}
      onChange={handleChange}
    />
  </div>

  <div className='text-center'>
    <button className='bg-primary text-white' type='submit'>Confirm Reservation</button>
  </div>
      </form>
    </>
 
  )
}

export default Reservations
