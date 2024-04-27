import React, {useState, useEffect} from 'react'
import axios from 'axios'
import '../App.css'
const forgotUrl = 'http://127.0.0.1:8000/restaurant/forgot_password'

function ForgotPassword() {
    const [useremail, setUseremail] = useState({email:""})
    
    const handleChange = (e)=>{
        const {name, value} = e.target
        setUseremail({...useremail, [name]:value})
    }

    console.log(useremail)
    const handleSubmit = (e)=>{
        e.preventDefault()
        const formData = new FormData()
        formData.append("email", useremail.email)

        axios.post(forgotUrl, formData)
        .then(response =>{
            console.log(response)
        }).catch(err => console.log(err))
    }
  return (
    <>
    <div className='text-center'>
      <h2>Forgot Password</h2>
    </div>

    <form className='text-center pssform' onSubmit={handleSubmit}>
    <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Enter Email
    </label>
    <input
      type="text"
      className="form-control"
      id="formGroupExampleInput"
      placeholder="Enter Email"
      name='email'
      value={useremail.email}
      onChange={handleChange}
    />
  </div>

  <button className='bg-primary text-center text-white' type='submit'>Submit Email</button>
    </form>
    </>
  )
}

export default ForgotPassword
