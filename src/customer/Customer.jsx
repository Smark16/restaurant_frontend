import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Context/AuthContext';
import order from '../Images/order.png';
import reserve from '../Images/reser.png';
import Chart from "react-apexcharts";
import Calendar from './calendar';
import axios from 'axios'

import './cust.css';

function Customer() {
  const { user,Loginloading} = useContext(AuthContext);
  const [UserReservation, setUserReservation] = useState([])
  const [Userorder, setUserOrder] = useState([])
  const userReservation = `http://127.0.0.1:8000/restaurant/user-reservation/${user.user_id}`
  const userOrder = `http://127.0.0.1:8000/restaurant/userOrder/${user.user_id}`
  
  const fetchUserReservations = async ()=>{
    try{
      const response = await axios(userReservation)
      const data = response.data
      setUserReservation(data)
    }catch(err){
      console.log('server error', err)
    }
  }

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
    fetchUserReservations()
    fetchUserOrder()
  }, [])
  const options = {
    colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
    dataLabels: {
      enabled: true,
      enabledOnSeries: undefined,
      formatter: function (val, opts) {
          return val;
      },
      textAnchor: 'middle',
      distributed: false,
      offsetX: 0,
      offsetY: 0,
      style: {
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 'bold',
          colors: undefined
      },
      background: {
        enabled: true,
        foreColor: '#fff',
        padding: 4,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fff',
        opacity: 0.9,
        dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45
        }
      },
      dropShadow: {
          enabled: false,
          top: 1,
          left: 1,
          blur: 1,
          color: '#000',
          opacity: 0.45
      }
    },
    chart: {
      id: "basic-bar"
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      title: {
        text: 'Months',
        style: {
          fontSize: '16px',
          fontWeight: 600,
          cssClass: 'apexcharts-xaxis-title',
        },
      },
    },
    yaxis: {
      title: {
        text: 'Expenses',
        style: {
          fontSize: '16px',
          fontWeight: 600,
          cssClass: 'apexcharts-yaxis-title',
        },
      },
    },
  };

  const series = [
    {
      name: "series-1",
      data: [30, 40, 45, 50, 49, 60, 70, 91]
    },
    {
      name: "series-2",
      data: [3, 60, 57, 46, 50, 45, 80, 92]
    }
  ];

  return (
    <>
{Loginloading ? (<>
<div className="shape-loader"></div>
<div className='shape-overlay'></div>
</>) : (<>
  <div className="mainsection bg-alert alert-secondary">
    <h4 className='text-center bg-success text-white p-3 menubar'>Welcome, {user.username}</h4>

<div className="result bg-white mt-2">
  <div className="order bg-alert alert-secondary">
    <div className="icon">
      <img src={reserve} alt="" className='cons' />
    </div>

    <div className="words">
      <p>Total Reservations</p>
      <h4>{UserReservation.length}</h4>
    </div>
  </div>

  <div className="order">
    <div className="icon">
      <i className="bi bi-bar-chart-line-fill cons"></i>
    </div>

    <div className="words">
      <p>Total Expense</p>
      <h4>UGX 89000</h4>
    </div>
  </div>

  <div className="order">
    <div className="icon">
      <img src={order} alt="" className='cons' />
    </div>

    <div className="words">
      <p>Total Order</p>
      <h4>{Userorder.length}</h4>
    </div>
  </div>

  <div className="order">
    <div className="icon">
      <i className="bi bi-wallet cons"></i>
    </div>

    <div className="words">
      <p>Wallet</p>
      <h4>UGX 3000</h4>
    </div>
  </div>
</div>

<div className="more">
<div className="graph bg-white p-2 mt-2">
  <Chart options={options} series={series} type="line" width="500" />
  {/* <Chart options={options} series={series} type="radar" width="500" /> */}
</div>

<div className="detail bg-white">

  <div className="calendar">
    <Calendar/>
  </div>
  <h4 className='text-center'>Product Details</h4>
  <ul className='list'>
    <li className='d-flex'>
      <span>Completed Orders</span>
      <h6 className='text-white bg-success p-2'>23</h6>
    </li>

    <li className='d-flex'>
      <span>Resevation Status</span>
      <h6 className='text-white bg-primary p-2'>Pending</h6>
    </li>
  </ul>
</div>
</div>

    </div>


</>)}
    </>
  );
}

export default Customer;
