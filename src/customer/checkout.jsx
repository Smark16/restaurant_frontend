import React, { useContext, useEffect, useState, useRef } from 'react';
import './cust.css';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import 'react-phone-input-2/lib/style.css';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { FlutterWaveButton, closePaymentModal } from 'flutterwave-react-v3';

const OrderItem = 'https://restaurant-backend5.onrender.com/restaurant/post_OrderItems';
const placedOrder = 'https://restaurant-backend5.onrender.com/restaurant/placed_orders';

function Checkout() {
  const { data, user, setAddItem, setTotal, setNotifyAll, notifyAll } = useContext(AuthContext);
  const [info, setInfo] = useState({ location: "", contact: "" });
  const [orderId, setOrderId] = useState('');
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false)
  const [instantPayment, setInstantPayment] = useState(false); // State to track instant payment option
  const [orderError, setOrderError] = useState('')
  const navigate = useNavigate();
  const socketRef = useRef(null);

  // total amount
  const totalAmount = data.map(item => {
    const { price, quantity } = item;
    return price * quantity;
  }).reduce((sum, total) => sum + total, 0).toFixed(2);

  // flutterwave
  const config = {
    public_key: 'FLWPUBK_TEST-64ed21a038fb9488488027e6c5ef2e70-X',
    tx_ref: Date.now(),
    amount: totalAmount,
    currency: 'UGX',
    payment_options: 'card, mobilemoneyuganda, banktransfer',
    customer: {
      email: user.email,
      phone_number: info.contact,
      name: user.username,
    },
    customizations: {
      title: 'Restaurant Management System',
      description: 'Payment for items in cart',
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const fwConfig = {
    ...config,
    text: 'Pay with Flutterwave!',
    callback: (response) => {
      console.log(response);
      closePaymentModal(); // this will close the modal programmatically
    },
    onClose: () => { },
  };

  // expense
  const itemExpense = data.reduce((accumulator, item) => {
    const { name, quantity, price } = item;
    const totalExpense = parseFloat(price * quantity);

    if (!accumulator[name]) {
      accumulator[name] = 0;
    }

    accumulator[name] += totalExpense;

    return accumulator;
  }, {});

  // websockets
  useEffect(() => {
    const url = `wss://restaurant-backend5.onrender.com/ws/admin/${user.user_id}/`;
    const socket = new WebSocket(url);
    socketRef.current = socket; // Assigning the WebSocket instance to socketRef.current

    socket.onopen = function (e) {
      console.log('WebSocket connection established');
    };

    socket.onclose = function (e) {
      console.log('WebSocket connection closed');
    };

    socket.onmessage = function (e) {
      let data = JSON.parse(e.data);
      console.log(data); // Ensure this logs data when the message event is triggered
      setNotifyAll(prevNotifyAll => [...prevNotifyAll, data]);
      console.log(notifyAll);
      if (data.type === 'notification') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification(`Order from ${user.username}`, {
              body: `${data.message}`,
            });
          }
        });
      }
    };

    // Cleanup function to close the WebSocket connection
    return () => {
      socket.close();
    };
  }, []);

  // handleChange
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
  };

  const handleInfo = async(e)=>{
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append('user', user.user_id);
    formData.append('location', info.location);
    formData.append('contact', info.contact);

    const orderResponse = await axios.post(placedOrder, formData);
    if(orderResponse.status === 201){
      setLoading(false)
      setInfo({ location: "", contact: ""})
    }
    const newOrderId = orderResponse.data.id;
    setOrderId(newOrderId);
  }
  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const orderItemData = new FormData();
      orderItemData.append('user', user.user_id);
      orderItemData.append('order', orderId);

      for (const Order_item of data) {
        const menuQuantityUpdate = `https://restaurant-backend5.onrender.com/restaurant/update_quantity/${Order_item.id}`;
        const quantityData = new FormData();
        quantityData.append("quantity", Order_item.quantity);

        await axios.patch(menuQuantityUpdate, quantityData)
          .then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          });

        orderItemData.append('menu', Order_item.id);
      }

      await axios.post(OrderItem, orderItemData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(response => {
        if (response.status === 201) {
          setAddItem([]);
          setTotal("");
          localStorage.removeItem("clickedItem");
          navigate("/customer/dashboard/receipt");
        }
      });

    } catch (err) {
      console.log('There was an error', err);
      if(err.response.data){
        setOrderError('Please Fill In All The Required Credentials')
      }
    } finally {
      setLoader(false);
    }

    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({
        'message': `${user.username}, an order has been placed `,
        'user': `${user.user_id}`
      }));
    }
  };

  return (
    <div className='checkout_page row'>
      {orderError && (<p className='alert alert-warning text-center'>{orderError}</p>)}
      <div className='otherInfo col-md-7 col-sm-12 p-2'>
        <h4 className='text-center text-white bg-primary p-2 mt-2'>Additional Information</h4>
        <form className='mt-2' onSubmit={handleInfo}>
          <div className='row'>
            <div className="mb-3">
              <label htmlFor="formGroupExampleInput" className="form-label">
                Location
              </label>
              <TextField
                className="form-control"
                id="formGroupExampleInput"
                label="Location"
                variant="outlined"
                name='location'
                value={info.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="formGroupExampleInput" className="form-label">
                Contact
              </label>
              <TextField
                label="Phone"
                className="form-control"
                id="formGroupExampleInput"
                variant="outlined"
                name='contact'
                type='number'
                value={info.contact}
                onChange={handleChange}
                required
              />
            </div>
          </div> 
          <button type='submit' className='info text-white text-center w-50 p-2'>{loading ? 'saving...' : 'save'}</button>
        </form>
        
        <div className="payment">
            <p>Choose Delivery Options</p>

            <ul>
              <li>
                <input
                  type='radio'
                  name='pay'
                  value='instant'
                  onChange={() => setInstantPayment(true)} // Set instantPayment to true
                />
                <span>Instant Payment</span>
              </li>

              <li>
                <input
                  type='radio'
                  name='pay'
                  value='cash'
                  onChange={() => setInstantPayment(false)} // Set instantPayment to false
                />
                <span>Cash On Delivery</span>
              </li>
              {instantPayment && ( // Conditional rendering based  texon instantPayment state
       <div className='flutterwave-button-container bg-primary text-center p-3'>
       <FlutterWaveButton {...fwConfig} />
     </div>
      )}
            </ul>
          </div>
      </div>

<div className='checkout col-md-4 bg-white'>
           <form onSubmit={handleSubmit}>
            <h3 className='text-center bg-primary p-3 text-white'>CHECKOUT ITEMS</h3>
            <h5 className='text-center check-item'>{data.length} ITEMS</h5>
            <ul>
              {Object.keys(itemExpense).map((itemName) => (
                <li key={itemName}>
                  <p>{itemName}</p>
                  <span>UGX {itemExpense[itemName].toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className='total bg-primary text-white p-3'>
              <h4>Total</h4>
              <span>UGX {totalAmount}</span>
            </div>

            <div className='sendOrder text-center'>
            <button className='btn btn-primary text-center text-white mt-5' type='submit' disabled={loader}>
              {loader ? 'Confirming...' : 'Confirm Order'}
            </button>
          </div>
</form>
          </div>
     
      
    </div>
  );
}

export default Checkout;
