import React, { useState } from 'react';
import { motion } from 'framer-motion';
import airtel from '../Images/airtel.jpeg';
import mtn from '../Images/mtn.jpeg';
import './cust.css';

function Payment() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      name: 'Airtel Money'
    },
    {
      id: 1,
      name: 'MTN MomoPay'
    }
  ];

  const changeTab = (id) => {
    setActiveTab(id);
  };

  return (
    <>
      <h2 className='text-center text-white p-2 bg-primary'>Make Your Payments</h2>

      <div>
        <ul className='line d-flex'>
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              className={activeTab === tab.id ? 'active' : ''}
            >
              {tab.name}
            </li>
          ))}
        </ul>

        <div className='content mt-2'>
          <motion.div
            className={`main airtel mt-3 ${activeTab === 0 ? 'active' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 0 && (
              <form>
                <div className='mb-3'>
                  <div className='tellogo d-flex p-2'>
                    <img src={airtel} alt='Airtel logo' />
                    <label htmlFor='formGroupExampleInput' className='form-label'>
                      Phone Number
                    </label>
                  </div>
                  <input type='number' className='form-control' id='formGroupExampleInput' />
                </div>

                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput' className='form-label'>
                    Enter Amount
                  </label>
                  <input type='text' className='form-control' id='formGroupExampleInput' />
                  <span>Minimum: UGX 5000 - Maximum: UGX 5,000,000,000</span>
                </div>

                <button className='bg-success text-center text-white p-2'>Make Deposit</button>
              </form>
            )}
          </motion.div>

          <motion.div
            className={`main mtn mt-3 ${activeTab === 1 ? 'active' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === 1 && (
              <form>
                <div className='mb-3'>
                  <div className='mtnlogo d-flex p-2'>
                    <img src={mtn} alt='MTN logo' />
                    <label htmlFor='formGroupExampleInput' className='form-label'>
                      Phone Number
                    </label>
                  </div>
                  <input type='number' className='form-control' id='formGroupExampleInput' />
                </div>

                <div className='mb-3'>
                  <label htmlFor='formGroupExampleInput' className='form-label'>
                    Enter Amount
                  </label>
                  <input type='text' className='form-control' id='formGroupExampleInput' />
                  <span>Minimum: UGX 5000 - Maximum: UGX 5,000,000,000</span>
                </div>
                <button className='bg-success text-center text-white p-2'>Make Deposit</button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Payment;
