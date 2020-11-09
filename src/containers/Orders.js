import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import dayjs from 'dayjs'

const Order = (props) => {
  const renderedOrder = props.products.map(product => (
    <React.Fragment key={product._id}>
      <h2>{product.prodId.title}</h2>
      <OrderImg src={product.prodId.image} alt={product.prodId.title}/>
      <p>${product.price}</p>
    </React.Fragment>
  ))

  const dateOrdered = dayjs(props.date).format('MMMM DD, YYYY')
  
  return (
    <OrderDiv>
      <div>
        <p>Date Ordered: {dateOrdered}</p>
        <p>Total: ${props.price}</p>
        <p onMouseEnter={props.mouseEnter} onMouseLeave={props.mouseExit}>Ship To: {props.address.name}</p>
        {props.isShown && (
          <div>
            <p>{props.address.name}</p>
            <p>{props.address.streetAddress}</p>
            <p>{props.address.city}, {props.address.province} {props.address.postalCode}</p>
            <p>{props.address.country}</p>
            <p>{props.address.phoneNumber}</p>
          </div>
        )}
      </div>
      {renderedOrder}
    </OrderDiv>
  )
}

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    //get the orders
    const userId = localStorage.getItem('userId');
    axios.post('/orders', { userId }).then(res => {
      setAllOrders(res.data)
    });
  }, []);

  console.log(allOrders)

  // these (and the state) could probably be in the Order comp, but wanted to keep state in Orders
  const mouseEnter = () => setIsShown(true)
  const mouseExit = () => setIsShown(false)

  const renderedOrders = allOrders.map(order => (
    <Order 
      key={order._id}
      id={order._id}
      products={order.products}
      price={order.subTotal}
      date={order.createdAt}
      address={order.contactInfo}
      speed={order.shippingSpeed}
      mouseEnter={mouseEnter}
      mouseExit={mouseExit}
      isShown={isShown}
    />
  ))

  return (
    <div>
      <h1>Your Orders</h1>
      {renderedOrders}
    </div>
  );
};

export default Orders;

const OrderDiv = styled.div`
  width: 500px;
  border: 1px solid black;
`

const OrderImg = styled.img`
  width: 400px;
`