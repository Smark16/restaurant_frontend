import React, {useState} from 'react'
import '../App.css'

function ChangePassword() {
    const [userPassword, setUserPassword] = useState('')
    

    const handlePassword =(e)=>{
    e.preventDefault()
    }

    console.log(userPassword)
  return (
    <>
    <div className='text-center'>
      <h2>Change Password</h2>
    </div>
    
    <form onSubmit={handlePassword} className='text-center pssform'>
    <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      New Password
    </label>
    <input
      type="password"
      className="form-control"
      id="formGroupExampleInput"
      placeholder="Enter new_password"
      name='userPassword'
      value={userPassword}
      onChange={(e)=>setUserPassword(e.target.value)}
    />
  </div>

<button className='bg-primary text-center text-white' type='submit'>Change Password</button>
    </form>
    </>
  )
}

export default ChangePassword
