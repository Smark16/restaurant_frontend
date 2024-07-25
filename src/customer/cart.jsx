import React, { useContext} from 'react';
import './cust.css';
import { AuthContext } from '../Context/AuthContext';
import 'react-phone-input-2/lib/style.css';
import { Link } from 'react-router-dom';

function Cart() {
  const { data, handleDelete, Increase, Reduce} = useContext(AuthContext);
 
  const itemExpense = data.reduce((accumulator, item) => {
    const { name, quantity, price } = item;
    const totalExpense = parseFloat(price * quantity);
    
    if (!accumulator[name]) {
      accumulator[name] = 0;
    }
    
    accumulator[name] += totalExpense;
    
    return accumulator;
  }, {});

  
  const totalAmount = data.map(item =>{
    const {price, quantity} = item
    return price * quantity
  }).reduce((sum, total) => sum + total, 0).toFixed(2)

  
  return (
    <>
      {data.length === 0 ? (
        <h1 className='text-center p-2 mt-5'>No orders placed yet</h1>
      ) : (
        <>
          <h2 className='alert alert-info text-black text-center p-2'>My Orders</h2>
          <div className='row cart_row'>
            <div className='cart text-center mt-3 selectedItems bg-white col-md-6 p-3'>
              {data.map((sele) => {
                const { id, name, price, image, quantity } = sele;
                return (
                  <div className="div">
 <div className="mt-3 cartcont " key={id}>
                    <div className="block d-flex">
                      <img src={image} alt={name} className='cartimg'></img>
                      <div className="block_info">
                      <h4>{name}</h4>                     
                      </div>
                    </div>
                      <p>UGX. {price}</p>
                  </div>
                  <div className="remove">
                    <i className="bi bi-trash-fill text-danger" onClick={() => handleDelete(id)}> Remove</i>
                    <div className="symb">
                        <button className='text-white text-center reduce' onClick={() => Reduce(sele)}>-</button>
                        <span>{quantity}</span>
                        <button className='bg-primary text-white text-center increase' onClick={() => Increase(sele)}>+</button>
                      </div>
                    </div>
                  </div>
                 
                );
              })}
            </div>
            <div className='otherInfo col-md-5 col-sm-12 p-2'>
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
                    <span>UGX {totalAmount }</span>
                  </div>
                </div>
                <div className='sendOrder text-center'>
                  <Link to='/customer/dashboard/Checkout'>
                  <button className='btn btn-primary text-center text-white mt-5'>
                   CHECKOUT (UGX {totalAmount })
                  </button>
                  </Link>
                 
                </div>
                
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Cart;
