import React, { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import axios from 'axios'

function PaymentStatus() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams(location.search)
  
  const trackingId = searchParams.get("OrderTrackingId");
  const merchantRef = searchParams.get("OrderMerchantReference");

  sessionStorage.setItem('pesapal_tracking_id', trackingId);
  sessionStorage.setItem('pesapal_merchant_ref', merchantRef);

  console.log('trackId:', trackingId, 'merchant_ref:', merchantRef);

  useEffect(()=>{
    if (trackingId && merchantRef) {
      // Use the production backend URL instead of localhost
      const callbackUrl = `https://restaurant-backend5.onrender.com/payments/v3/pesapal-callback/?OrderTrackingId=${trackingId}&OrderMerchantReference=${merchantRef}`;
  
      axios
        .get(callbackUrl)
        .then((res) => {
          console.log("✅ Payment status updated:", res.data);
          // Show payment status to the user via Snackbar
          // setSnackbarMessage(`Payment Status: ${res.data.detail}`);
          // setSnackbarOpen(true);
        })
        .catch((err) => {
          console.error("❌ Failed to update payment status:", err);
          // setSnackbarMessage("Failed to update payment status. Please try again.");
          // setSnackbarOpen(true);
        });
    } else {
      console.log("No trackingId or merchantRef found in URL");
    }
  }, [])

  return (
    <div>
      Payment successfull
      {/* <button onClick={handleRedirect}>Proceed to order</button> */}
    </div>
  )
}

export default PaymentStatus
