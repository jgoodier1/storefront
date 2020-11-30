import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import dayjs from 'dayjs';

import Modal from '../components/Modal';
import Button from '../components/Button';

interface OrderProps {
  key: number;
  id: string;
  products: [
    {
      _id: number;
      prodId: {
        _id: number;
        title: string;
        image: string;
      };
      price: number;
      quantity: number;
    }
  ];
  price: number;
  date: number;
  address: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
  };
  speed: string;
}

interface OrdersProps {
  showModal: () => void;
  isLoggedIn: boolean;
}

const Order = (props: OrderProps) => {
  //put state here because it would show for every order
  const [isShown, setIsShown] = useState(false);

  const popoverOpen = () => {
    setIsShown(true);
  };

  const popoverClose = () => {
    setIsShown(false);
  };

  const renderedOrder = props.products.map(product => (
    <StyledProdDiv key={product._id}>
      <StyledTitle to={'/products/' + product.prodId._id}>
        {product.prodId.title}
      </StyledTitle>
      {/* <StyledTitle>{product.prodId.title}</StyledTitle> */}
      <StyledImg src={product.prodId.image} alt={product.prodId.title} />
      <StyledPrice>${product.price}</StyledPrice>
      <StyledQty>Qty: {product.quantity}</StyledQty>
      {/* <StyledLink to=''></StyledLink> */}
    </StyledProdDiv>
  ));

  const dateOrdered = dayjs(props.date).format('MMM DD, YYYY');
  let deliveryDate;
  if (props.speed === 'fast') {
    deliveryDate = dayjs(dateOrdered).add(3, 'day').format('MMM DD, YYYY');
  } else if (props.speed === 'normal') {
    deliveryDate = dayjs(dateOrdered).add(4, 'day').format('MMM DD, YYYY');
  }

  return (
    <StyledOrderDiv>
      <StyledTopBarDiv>
        <StyledP>
          Date Ordered: <span>{dateOrdered}</span>
        </StyledP>
        <StyledP>
          Total: <span>${props.price.toFixed(2)}</span>
        </StyledP>
        <StyledP onMouseEnter={popoverOpen} onMouseLeave={popoverClose}>
          Ship To:{' '}
          <span>
            {props.address.firstName} {props.address.lastName}
          </span>
        </StyledP>
        {isShown && (
          <StyledPopoverDiv>
            <StyledPopoverP>{props.address.firstName}</StyledPopoverP>
            <StyledPopoverP>{props.address.lastName}</StyledPopoverP>
            <StyledPopoverP>{props.address.streetAddress}</StyledPopoverP>
            <StyledPopoverP>
              {props.address.city}, {props.address.province} {props.address.postalCode}
            </StyledPopoverP>
            <StyledPopoverP>{props.address.country}</StyledPopoverP>
            <StyledPopoverP>{props.address.phoneNumber}</StyledPopoverP>
          </StyledPopoverDiv>
        )}
      </StyledTopBarDiv>
      <StyledH2>Expected Delivery: {deliveryDate}</StyledH2>
      {renderedOrder}
    </StyledOrderDiv>
  );
};

const Orders = (props: OrdersProps) => {
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [errModal, setErrModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (props.isLoggedIn) {
      const userId = localStorage.getItem('userId');
      axios
        .post('/orders', { userId })
        .then(res => {
          setAllOrders(res.data);
          setErrModal(false);
          setError('');
          // console.log(res.data);
        })
        .catch(err => {
          // console.error(err);
          setErrModal(true);
          setError('Cannot load orders, please try again');
        });
    } else return;
  }, [props.isLoggedIn]);

  const modalClosed = () => {
    setErrModal(false);
    history.push('/');
  };

  const notAuth = (
    <>
      <StyledAuthH2>Please sign in to continue</StyledAuthH2>
      <StyledAuthBttn clicked={props.showModal}>Sign In</StyledAuthBttn>
    </>
  );

  const renderedOrders = allOrders.map(order => (
    <Order
      key={order._id}
      id={order._id}
      products={order.products}
      price={order.totalPrice}
      date={order.createdAt}
      address={order.contactInfo}
      speed={order.shippingSpeed}
    />
  ));

  return (
    <StyledOrdersDiv>
      {props.isLoggedIn ? (
        errModal ? (
          <Modal show={errModal} modalClosed={modalClosed}>
            <StyledButton onClick={modalClosed}>X</StyledButton>
            {error}
          </Modal>
        ) : (
          <>
            <h1 style={{ justifySelf: 'center' }}>Your Orders</h1>
            <StyledRendedOrdersDiv>{renderedOrders}</StyledRendedOrdersDiv>
          </>
        )
      ) : (
        notAuth
      )}
    </StyledOrdersDiv>
  );
};

export default Orders;

const StyledOrdersDiv = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2fr minmax(0, 1fr);
  grid-gap: 15px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StyledRendedOrdersDiv = styled.div`
  @media (max-width: 768px) {
    grid-row-start: 2;
  }
`;

const StyledOrderDiv = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 20px 0;
`;

const StyledTopBarDiv = styled.div`
  grid-column: 2/3;
  display: flex;
  justify-content: space-between;
  background: #f6f6f6;
  padding: 0 2rem;
  z-index: 199;
  position: relative;
`;

const StyledP = styled.p`
  display: flex;
  flex-flow: column;
`;

const StyledPopoverDiv = styled.div`
  position: absolute;
  z-index: 200;
  background: #fff;
  padding: 1rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  justify-self: flex-end;
  top: 4rem;
  left: 28rem;
`;

const StyledPopoverP = styled.p`
  margin: 0;
`;

const StyledH2 = styled.h2`
  margin-left: 2rem;
`;

const StyledProdDiv = styled.div`
  grid-column: 2/3;
  display: grid;
  grid-template-columns: 10rem 1fr 1fr;
  grid-gap: 5px;
  padding: 2rem;
  width: 70%;
`;

const StyledImg = styled.img`
  max-width: 10rem;
  grid-column: 1/2;
  grid-row: 1/4;
`;

const StyledTitle = styled(Link)`
  grid-column: 2/4;
  grid-row: 1/2;
  width: max-content;
  font-weight: bold;
  font-size: 20px;
  color: #3f6cd7;
  text-decoration: none;

  @media (max-width: 768px) {
    width: auto;
  }
`;

const StyledPrice = styled.p`
  grid-column: 2/3;
  font-weight: bold;
`;

const StyledQty = styled.p`
  grid-column: 3/4;
  font-weight: bold;
  width: max-content;
`;

const StyledAuthH2 = styled.h2`
  grid-column: 2/3;
  place-self: center;
  width: max-content;
`;

const StyledAuthBttn = styled(Button)`
  grid-column: 2/3;
  width: max-content;
  padding: 1rem;
  place-self: center;
`;

const StyledButton = styled.button`
  grid-area: bttn;
  position: relative;
  top: 6px;
  right: 10px;
  border: 0;
  width: 60px;
  height: 60px;
  font-size: 1.75rem;
  font-weight: bold;
  background-color: white;
  cursor: pointer;
`;
