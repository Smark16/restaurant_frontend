import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import $ from 'jquery'; 
import 'datatables.net';
import 'datatables.net-bs4';
import axios from 'axios';
const menuUrl = 'http://127.0.0.1:8000/restaurant/food_items'

function Customers() {
  useEffect(() => {
    const fetchDataAndInitializeTable = async () => {
      try {
        const response = await axios(menuUrl);
        const data = response.data;
        console.log(data);

        const tableBody = $('.myTable tbody');
        tableBody.empty();

        data.forEach((tdata) => {
          const { id, name, price, image, avg_rating} = tdata;
          const rowHtml = `<tr>
              <td>${name}</td>
              <td>shs. ${price}</td>
              <td><img src=${image} alt='user image' class='myimage'></td>
              <td>${avg_rating}</td>
            </tr>`;
          tableBody.append(rowHtml);
        });
        $('.myTable').DataTable();
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDataAndInitializeTable();

  }, []); 
  
  return (
    <div>
      <table className='table myTable table-striped table-hover'>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>image</th>
            <th>avg_rating</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    
  );
}

export default Customers;
