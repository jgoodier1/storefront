import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

import Modal from '../components/Modal';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import useFetch from '../hooks/useFetch';
import { selectAuthState, showModal } from '../reduxSlices/authSlice';

interface OrderProps {
  key: number;
  id: number;
  products: {
    prod_id: number;
    title: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  price: string;
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
    streetAddressTwo?: string;
  };
  speed: string;
}

interface ResOrder {
  order_id: number;
  user_id: number;
  email: string;
  products: {
    prod_id: number;
    title: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  total_price: string;
  shipping_speed: string;
  date: number;
  contactInfo: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    streetAddressTwo?: string;
  };
}

const Order: React.FC<OrderProps> = props => {
  //put state here because it would show for every order
  const [isShown, setIsShown] = useState(false);

  const popoverOpen = () => {
    setIsShown(true);
  };

  const popoverClose = () => {
    setIsShown(false);
  };

  const renderedOrder = props.products.map(product => (
    <StyledProdDiv key={product.prod_id}>
      <StyledTitle to={'/products/' + product.prod_id}>{product.title}</StyledTitle>
      <StyledImg src={product.image} alt={product.title} />
      <StyledPrice>${product.price}</StyledPrice>
      <StyledQty>Qty: {product.quantity}</StyledQty>
    </StyledProdDiv>
  ));

  const dateOrdered = dayjs(props.date).format('MMM DD, YYYY');
  let deliveryDate;
  if (props.speed === 'fast') {
    deliveryDate = dayjs(dateOrdered).add(3, 'day');
  } else if (props.speed === 'normal') {
    deliveryDate = dayjs(dateOrdered).add(4, 'day');
  }

  return (
    <StyledOrderDiv>
      <StyledTopBarDiv>
        <StyledP>
          Date Ordered: <span>{dateOrdered}</span>
        </StyledP>
        <StyledP>
          Total: <span>${Number(props.price).toFixed(2)}</span>
        </StyledP>
        <StyledP onMouseEnter={popoverOpen} onMouseLeave={popoverClose}>
          Ship To:{' '}
          <span>
            {props.address.firstName} {props.address.lastName}
          </span>
        </StyledP>
        {isShown && (
          <StyledPopoverDiv>
            <StyledPopoverP>
              <strong>
                {props.address.firstName} {props.address.lastName}
              </strong>
            </StyledPopoverP>
            <StyledPopoverP>{props.address.streetAddress}</StyledPopoverP>
            {props.address.streetAddressTwo && (
              <StyledPopoverP>{props.address.streetAddressTwo}</StyledPopoverP>
            )}
            <StyledPopoverP>
              {props.address.city}, {props.address.province} {props.address.postalCode}
            </StyledPopoverP>
            <StyledPopoverP>{props.address.country}</StyledPopoverP>
            <StyledPopoverP>{props.address.phoneNumber}</StyledPopoverP>
          </StyledPopoverDiv>
        )}
      </StyledTopBarDiv>
      {deliveryDate !== undefined && +deliveryDate.valueOf() > +dayjs().valueOf() ? (
        <StyledH2>Expected Delivery: {deliveryDate.format('MMM DD, YYYY')}</StyledH2>
      ) : (
        <StyledH2>
          Delivered: {deliveryDate !== undefined && deliveryDate.format('MMM DD, YYYY')}
        </StyledH2>
      )}
      {renderedOrder}
    </StyledOrderDiv>
  );
};

const Orders: React.FC = () => {
  const userId = localStorage.getItem('userId');
  const [orders, compState] = useFetch('POST', '/orders', { userId });
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectAuthState);

  const notAuth = (
    <>
      <StyledAuthH2>Please sign in to continue</StyledAuthH2>
      <StyledAuthBttn clicked={() => dispatch(showModal())}>Sign In</StyledAuthBttn>
    </>
  );

  let renderedOrders;
  if (compState === 'Loading') {
    renderedOrders = <Spinner />;
  } else if (compState === 'Rendered' && (orders === null || orders.data.length === 0)) {
    renderedOrders = (
      <>
        <h2>You haven't ordered anything yet!</h2>
        <p>
          Go to <StyledLink to='/products'>products</StyledLink> to browse the products,
          or use the search bar to search for something.
        </p>
      </>
    );
  } else if (compState === 'Rendered' && orders !== null) {
    renderedOrders = orders.data.map((order: ResOrder) => (
      <Order
        key={order.order_id}
        id={order.order_id}
        products={order.products}
        price={order.total_price}
        date={order.date}
        address={order.contactInfo}
        speed={order.shipping_speed}
      />
    ));
    renderedOrders.reverse();
  }

  return (
    <StyledMain>
      {isLoggedIn ? (
        compState === 'Error' ? (
          <Modal show={compState === 'Error'}>
            <h1>Error</h1>
            Cannot load orders, please try again.
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
    </StyledMain>
  );
};

export default Orders;

const StyledMain = styled.main`
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

  @media (max-width: 768px) {
    justify-content: space-around;
    padding: 0;
  }
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
  width: max-content;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 1px solid #f6f6f6;
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
  grid-gap: 15px;
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

const StyledLink = styled(Link)`
  color: #3f6cd7;
  text-decoration: none;
`;
