import React, { useContext, useEffect, useState, useRef } from 'react';
import './cust.css';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import 'react-phone-input-2/lib/style.css';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import useHook from './customhook';

const OrderItem = 'https://restaurant-backend5.onrender.com/restaurant/post_OrderItems';
const placedOrder = 'https://restaurant-backend5.onrender.com/restaurant/placed_orders';

function Cart() {
  const { data, user, handleDelete, setAddItem, setTotal, Increase, Reduce, total } = useContext(AuthContext);
  const [info, setInfo] = useState({ location: "", contact: "" });
  const [orderId, setOrderId] = useState('');
  const [loader, setLoader] = useState(false);
  const userOrder = `https://restaurant-backend5.onrender.com/restaurant/userOrder/${user.user_id}`;
  const notificationOrderUrl = `https://restaurant-backend5.onrender.com/restaurant/usermsg/${user.user_id}`;
  const { notifyAll, setNotifyAll } = useHook(notificationOrderUrl);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const itemExpense = data.reduce((accumulator, item) => {
    const { name, quantity, price } = item;
    const totalExpense = parseFloat(price * quantity);
    
    if (!accumulator[name]) {
      accumulator[name] = 0;
    }
    
    accumulator[name] += totalExpense;
    
    return accumulator;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({ ...info, [name]: value });
    console.log(name, value);
  };

  useEffect(() => {
    const url = `wss://restaurant-backend5.onrender.com/ws/socket-server/${user.user_id}/`;
    const socket = new WebSocket(url);
    socketRef.current = socket; // Assigning the WebSocket instance to socketRef.current

    socket.onopen = function(e) {
      console.log('WebSocket connection established');
    };

    socket.onclose = function(e) {
      console.log('WebSocket connection closed');
    };

    socket.onmessage = function(e) {
      let data = JSON.parse(e.data);
      console.log(data);  // Ensure this logs data when the message event is triggered
      setNotifyAll(prevNotifyAll => [...prevNotifyAll, data]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    try {
      const formData = new FormData();
      formData.append('user', user.user_id);
      formData.append('location', info.location);
      formData.append('contact', info.contact);

      const orderResponse = await axios.post(placedOrder, formData);
      const newOrderId = orderResponse.data.id;
      setOrderId(newOrderId);

      const orderItemData = new FormData();
      orderItemData.append('user', user.user_id);
      orderItemData.append('order', newOrderId);

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
          setAddItem([])
          setTotal("")
          localStorage.removeItem("clickedItem")
          navigate("/customer/dashboard/receipt");
        }
      });

      if (socketRef.current) {
        socketRef.current.send(JSON.stringify({
          'message': `${user.username} has placed an order`,
          'user': `${user.user_id}`
        }));
      }

    } catch (err) {
      console.log('There was an error', err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {data.length === 0 ? (
        <h1 className='text-center p-2 mt-5'>No orders placed yet</h1>
      ) : (
        <>
          <h2 className='bg-success text-white text-center p-2'>My Orders</h2>
          <div className='row cart_row'>
            <div className='cart text-center mt-3 selectedItems col-md-6 col-sm-12 bg-white p-3'>
              {data.map((sele) => {
                const { id, name, price, image, quantity } = sele;
                return (
                  <div className="mt-3 cartcont" key={id}>
                    <div className="block">
                      <h4>{name}</h4>
                      <img src={image} alt={name} className='cartimg'></img>
                    </div>
                    <div className="content">
                      <p>UGX. {price}</p>
                      <div className="symb">
                        <button className='bg-danger text-white text-center' onClick={() => Reduce(sele)}>-</button>
                        <span>{quantity}</span>
                        <button className='bg-primary text-white text-center' onClick={() => Increase(sele)}>+</button>
                      </div>
                      <div className="btns">
                        <button className='bg-danger text-white text-center' onClick={() => handleDelete(id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='otherInfo col-md-5 col-sm-12 p-2'>
              <h4 className='text-center text-white bg-primary p-2 mt-2'>Additional Information</h4>
              <form className='mt-2' onSubmit={handleSubmit}>
                <div className='row'>
                  <div className='col'>
                    <TextField
                      id="outlined-basic"
                      label="Location"
                      variant="outlined"
                      name='location'
                      value={info.location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='col'>
                    <TextField
                      id="outlined-basic"
                      label="Phone"
                      variant="outlined"
                      name='contact'
                      type='number'
                      value={info.contact}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className='checkout mt-4'>
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
                    <span>UGX {total}</span>
                  </div>
                </div>
                <div className='sendOrder text-center'>
                  <button className='bg-primary text-center text-white mt-5' type='submit' disabled={loader}>
                    {loader ? 'Confirming...' : 'Confirm Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Cart;
