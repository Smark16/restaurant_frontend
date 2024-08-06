import React, { useContext, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { AuthContext } from '../Context/AuthContext'
import useAxios from '../components/useAxios';

const tables = 'https://restaurant-backend5.onrender.com/restaurant/tables'
const newReservation = 'https://restaurant-backend5.onrender.com/restaurant/new_reservation'

function Reservations() {
  const { user, showSuccessAlert, showErrorAlert} = useContext(AuthContext)
  // const {messaging, generateToken} = tokenGeneration()
  const axiosInstance = useAxios();
  const [reservation, setReservation] = useState({ contact: "", Email: "", party_size: "", table: "", reservation_date: "" })
  const [table, setTable] = useState([])
  const [result, setResult] = useState('')
  const [reserve, setReserve] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  
  
 
  const navigate = useNavigate()
  const socketRef = useRef(null);

  const fetchTables = async () => {
    try {
      const response = await axios(tables)
      const data = response.data
      setTable(data)
    } catch (err) {
      console.log("No table")
    }
  }

  const handleTable = (e) => {
    const tableNo = e.target.value
    setReservation({ ...reservation, table: tableNo })
  }

  const handleSubmit = async(e) => {
  setConfirmed(true)
    e.preventDefault()
    const formData = new FormData()
    formData.append("user", user.user_id)
    formData.append("contact", reservation.contact)
    formData.append("email", reservation.Email)
    formData.append("party_size", reservation.party_size)
    formData.append("table", reservation.table)
    formData.append("reservation_date", reservation.reservation_date)

    await axios.post(newReservation, formData)
      .then(res => {
        if (res.status === 200) {
          setResult(res.data.response)
        } else if (res.status === 201) {
          setReserve(res.data.response)
          setResult('')
          setReservation({ contact: "", Email: "", party_size: "", table: "", reservation_date: "" })
          showSuccessAlert("Reservation Made Successfully")
          setConfirmed(false)
          navigate("/customer/dashboard")
        } else {
          showErrorAlert("Please fill in all Details")
          setConfirmed(false)
        }

      }).catch(err => {
        console.log("An error occurred", err)
        setConfirmed(false)
      })

  }

  console.log(result)
  useEffect(() => {
    fetchTables()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setReservation({ ...reservation, [name]: value })
  }

  return (
    <>
    {/* <Toaster position='top-right'/> */}
      <h2 className='text-center bg-success text-white p-2'>Make Your reservation</h2>

      <h5>{reserve}</h5>
      <div className="form_container">
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
              {table.map(tb => {
                const { id, table_no } = tb
                return (
                  <option key={id} value={id}>Table: {table_no}</option>
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
      </div>
    </>
  )
}

export default Reservations
