import React, { useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  useEffect(() => {
    //get the orders
    const userId = localStorage.getItem('userId');
    axios.post('/orders', { userId }).then(res => {
      console.log('Orders useEffect', res.data);
    });
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>
    </div>
  );
};

export default Orders;
