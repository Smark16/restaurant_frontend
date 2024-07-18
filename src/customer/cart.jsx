import React, { useContext, useEffect, useState } from 'react';
import './cust.css';
import { AuthContext } from '../Context/AuthContext';
import axios from 'axios';
import 'react-phone-input-2/lib/style.css';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import useHook from './customhook';

const OrderItem = 'http://127.0.0.1:8000/restaurant/post_OrderItems';
const placedOrder = 'http://127.0.0.1:8000/restaurant/placed_orders';

function Cart() {
  const {data, user,handleDelete, newData, Increase, Reduce} = useContext(AuthContext)   
  console.log(newData)
  const [info, setInfo] = useState({location:"", contact:""})
  const [orderId, setOrderId] = useState('')
  const [Userorder, setUserOrder] = useState([])
  const [dispReceipt, setDispReceipt] = useState(false)
  const [loader, setLoader] = useState(false)
  const userOrder = `http://127.0.0.1:8000/restaurant/userOrder/${user.user_id}`
  const notificationOrderUrl =  `http://127.0.0.1:8000/restaurant/usermsg/${user.user_id}`
const {orderNotify, setOrderNotify} = useHook(notificationOrderUrl)
  // const userOrder = `https://restaurant-backend-5.onrender.com/restaurant/userOrder/${user.user_id}`


  // calculate expense for individual item
  const itemExpense = data.reduce((accumulator, item) => {
    const { name, quantity, price } = item;
    const totalExpense = parseFloat(price * quantity);

    if (!accumulator[name]) {
      accumulator[name] = 0;
    }

    accumulator[name] += totalExpense;

    return accumulator;
  }, {});

  // for (const itemName in itemExpense) {
  //   if (itemExpense.hasOwnProperty(itemName)) {
  //     console.log(`${itemName}: shs. ${itemExpense[itemName].toFixed(2)}`);
  //   }
  // }

  const fetchUserOrder = async ()=>{
    try{
      const response = await axios(userOrder)
      const data = response.data
      setUserOrder(data)
    }catch(err){
      console.log('server error', err)
    }
  }

  useEffect(()=>{
    fetchUserOrder()
  }, [])

const handleChange = (e) =>{
  const {name, value} = e.target
  setInfo({...info, [name]:value})
  console.log(name, value)
}

// Handle Notifications
let url = 'ws://127.0.0.1:8000/ws/socket-server/';
const socket = new WebSocket(url);
useEffect(() => {
  
  socket.onmessage = function (e) {
    let data = JSON.parse(e.data);
    console.log(data)  
    setOrderNotify([...orderNotify, data])
  };

 
}, []);
const overlay = document.querySelector('.overlay')
const modalform = document.querySelector('.modal-form')
const modalall = document.querySelector('.modal-all')

const removeOverlay = ()=>{
  overlay.classList.remove('overlay')
  modalform.style.display = 'none';
  modalall.style.display = 'none';
}

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('user', user.user_id)
  formData.append('location', info.location);
  formData.append('contact', info.contact);
    
  axios.post(placedOrder, formData)
  .then(res =>{
    setOrderId(res.data.id)
  }).catch (err =>{
    console.log(err)
  })
console.log(orderId)
  const orderItemData = new FormData()
  const total_item = newData.map(item => {
    const {quantity} = item
    return quantity
}).reduce((acc, amount) => acc + amount, 1)
console.log(total_item)
  newData.forEach(Order_item =>{
    console.log(Order_item)
    orderItemData.append('user', user.user_id)
    orderItemData.append('order', orderId )
    orderItemData.append('menu', Order_item.id)
    orderItemData.append('total_quantity', total_item)
  })
  axios
    .post(OrderItem, orderItemData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set the content type for multipart form data
      }
    })
    .then((res) => {
      console.log(res);
      alert('order confirmed successfully')
    })
    .catch((err) => {
      console.log('There was an error', err);
    });

socket.send(JSON.stringify({
  'message': `${user.username} has placed an order`,
  'user':`${user.user_id}`
}))
setDispReceipt(true)
};

const removeModal = ()=>{
  setDispReceipt(false)
}
const Download = () => {
  setLoader(true);
  const capture = document.querySelector('.modal-form');
  const options = {
    scrollY: -window.scrollY, // Fixes issue with capturing scrollable elements
    scale: 2, // Increase scale for higher resolution
    useCORS: true // Enable cross-origin resource sharing (CORS)
  };

  html2canvas(capture, options).then((canvas) => {
    const imgData = canvas.toDataURL('image/png'); /* Convert canvas to image URL */
    const doc = new jsPDF('p', 'mm', 'a4');
    const componentWidth = doc.internal.pageSize.getWidth();
    const componentHeight = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
    setLoader(false);
    doc.save('receipt.pdf'); // Save PDF with the name 'receipt.pdf'
  });
};


const totalAmount = data.map(prices =>{
  const {price, quantity} = prices
  return price * quantity
}).reduce((sum, amount) => sum + amount, 0).toFixed(2)


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
                        <button className='bg-danger text-white text-center' onClick={()=>Reduce(sele)}>-</button>
                        <span>{quantity}</span>
                        <button className='bg-primary text-white text-center'onClick={()=>Increase(sele)}>+</button>
                      </div>
                      <div className="btns">
                        <button className='bg-danger text-white text-center' onClick={()=>handleDelete(id)}>Delete</button>
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
                    <span>UGX {totalAmount}</span>
                  </div>
                </div>
                <div className='sendOrder text-center'>
                  <button className='bg-primary text-center text-white mt-5' type='submit'>
                    {confirm ? 'Confirming...' : 'Confirm Order'}
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
