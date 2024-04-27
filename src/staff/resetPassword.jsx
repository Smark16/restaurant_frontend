import React from 'react'

function ResetPassword() {
  return (
    <>
     <div className='text-white text-center bg-success p-3 mt-3'>
     <h5>Reset Password</h5> 
    </div>
    <form>
  <div className="mb-3">
    <label htmlFor="formGroupExampleInput" className="form-label">
      Old password
    </label>
    <input
      type="text"
      className="form-control"
      id="formGroupExampleInput"
      placeholder="Enter old_password"
    
    />
  </div>
  <div className="mb-3">
    <label htmlFor="formGroupExampleInput2" className="form-label">
      New Password
    </label>
    <input
      type="text"
      className="form-control"
      id="formGroupExampleInput2"
      placeholder="Enter new_password"
    />
  </div>

  <div className="mb-3">
    <label htmlFor="formGroupExampleInput2" className="form-label">
      confirm Password
    </label>
    <input
      type="text"
      className="form-control"
      id="formGroupExampleInput2"
      placeholder="cofirm_password"
    />
  </div>
  <div className="mb-3">
   <button className='bg-primary text-white' type='submit'>Save Password</button>
  </div>
    </form>
    </>
   
  )
}

export default ResetPassword
