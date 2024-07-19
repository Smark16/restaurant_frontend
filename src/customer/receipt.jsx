import React, { useContext, useEffect, useState } from 'react';
import './cust.css';
import { AuthContext } from '../Context/AuthContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';

function Receipt() {
  const { data, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [userOrder, setUserOrder] = useState(null);
  const [loader, setLoader] = useState(false);
  const userOrderUrl = `https://restaurant-backend5.onrender.com/restaurant/userOrder/${user.user_id}`;
  console.log(userOrderUrl);

  const itemExpense = data.reduce((accumulator, item) => {
    const { name, quantity, price } = item;
    const totalExpense = parseFloat(price * quantity);

    if (!accumulator[name]) {
      accumulator[name] = 0;
    }

    accumulator[name] += totalExpense;

    return accumulator;
  }, {});

  const fetchUserOrder = async () => {
    try {
      const response = await axios.get(userOrderUrl);
      const data = response.data;
      if (data.length > 0) {
        setUserOrder(data[data.length - 1]); // Set the latest order
      }
      setLoading(false);
    } catch (err) {
      console.log('server error', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrder();
  }, []);

  const Download = () => {
    setLoader(true);
    const element = document.querySelector('.modal-form');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('receipt.pdf');
      setLoader(false);
    });
  };

  const totalAmount = data
    .map((prices) => prices.price * prices.quantity)
    .reduce((sum, amount) => sum + amount, 0)
    .toFixed(2);

  return (
    <>
      {loading ? (
        <span className="menuloader"></span>
      ) : (
        <div className='modal-all bg-white p-2'>
          <div className='modal-dialog modal-dialog-scrollable modal-form'>
            <h6 className='bg-success text-center p-3 text-white'>CHECKOUT RECEIPT</h6>
            <span className='text-center modal-item'>ITEMS</span>
            <ul>
              {Object.keys(itemExpense).map((itemName) => (
                <li key={itemName}>
                  <p>{itemName}</p>
                  <span>UGX {itemExpense[itemName].toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <span className='text-center addinfo'>ADDITIONAL INFORMATION</span>
            <ul>
              {userOrder && (
                <>
                  <li>
                    <p>Location</p>
                    <span>{userOrder.location}</span>
                  </li>
                  <li>
                    <p>Contact</p>
                    <span>{userOrder.contact}</span>
                  </li>
                </>
              )}
            </ul>
            <div className='total bg-primary text-white p-3'>
              <h4>Total</h4>
              <span>UGX {totalAmount}</span>
            </div>
          </div>
          <button className='bg-primary text-center text-white mt-4 dnl-btn p-2' onClick={Download}>
            {loader ? 'Downloading...' : 'Download Receipt'}
          </button>
        </div>
      )}
    </>
  );
}

export default Receipt;
