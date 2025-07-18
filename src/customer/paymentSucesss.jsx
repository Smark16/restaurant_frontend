import React from 'react'
import { useNavigate } from 'react-router-dom'

function paymentSucesss() {
    const navigate = useNavigate()

    const handleRedirect =()=>{
        navigate('/customer/dashboard/Checkout')
    }
  return (
    <div>
      Payment successfull
      <button onClick={handleRedirect}>Proceed to order</button>
    </div>
  )
}

export default paymentSucesss
