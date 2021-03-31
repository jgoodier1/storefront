import React from 'react';
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
  const renderedOrder = props.products.map(product => (
    <ProductContainer key={product.prod_id}>
      <Title to={'/products/' + product.prod_id}>{product.title}</Title>
      <Image src={product.image} alt={product.title} />
      <Price>${product.price}</Price>
      <Quantity>Qty: {product.quantity}</Quantity>
    </ProductContainer>
  ));

  const dateOrdered = dayjs(props.date).format('MMM DD, YYYY');
  let deliveryDate;
  if (props.speed === 'fast') {
    deliveryDate = dayjs(dateOrdered).add(3, 'day');
  } else if (props.speed === 'normal') {
    deliveryDate = dayjs(dateOrdered).add(4, 'day');
  }

  return (
    <OrderContainer>
      <TopRowContainer>
        <Paragraph>
          Date Ordered: <span>{dateOrdered}</span>
        </Paragraph>
        <Paragraph>
          Total: <span>${Number(props.price).toFixed(2)}</span>
        </Paragraph>
        <Paragraph>
          Ship To:{' '}
          <span>
            {props.address.firstName} {props.address.lastName}
          </span>
          <PopoverContainer>
            <PopoverParagraph>
              <strong>
                {props.address.firstName} {props.address.lastName}
              </strong>
            </PopoverParagraph>
            <PopoverParagraph>{props.address.streetAddress}</PopoverParagraph>
            {props.address.streetAddressTwo && (
              <PopoverParagraph>{props.address.streetAddressTwo}</PopoverParagraph>
            )}
            <PopoverParagraph>
              {props.address.city}, {props.address.province} {props.address.postalCode}
            </PopoverParagraph>
            <PopoverParagraph>{props.address.country}</PopoverParagraph>
            <PopoverParagraph>{props.address.phoneNumber}</PopoverParagraph>
          </PopoverContainer>
        </Paragraph>
      </TopRowContainer>
      {deliveryDate !== undefined && +deliveryDate.valueOf() > +dayjs().valueOf() ? (
        <DeliveryHeading>
          Expected Delivery: {deliveryDate.format('MMM DD, YYYY')}
        </DeliveryHeading>
      ) : (
        <DeliveryHeading>
          Delivered: {deliveryDate !== undefined && deliveryDate.format('MMM DD, YYYY')}
        </DeliveryHeading>
      )}
      {renderedOrder}
    </OrderContainer>
  );
};

const Orders: React.FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectAuthState);
  const [orders, compState] = useFetch<ResOrder[]>('GET', '/orders', { isLoggedIn });

  const notAuth = (
    <>
      <UnauthorizedHeading>Please sign in to continue</UnauthorizedHeading>
      <SignInButton clicked={() => dispatch(showModal())}>Sign In</SignInButton>
    </>
  );

  let renderedOrders;
  if (compState === 'Loading') {
    renderedOrders = <Spinner />;
  } else if (compState === 'Rendered' && (orders === null || orders.length === 0)) {
    renderedOrders = (
      <>
        <h2>You haven't ordered anything yet!</h2>
        <p>
          Go to <ExtendedLink to='/products'>products</ExtendedLink> to browse the
          products, or use the search bar to search for something.
        </p>
      </>
    );
  } else if (compState === 'Rendered' && Array.isArray(orders)) {
    renderedOrders = orders.map((order: ResOrder) => (
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
    <Main>
      {isLoggedIn ? (
        compState === 'Error' ? (
          <Modal show={compState === 'Error'}>
            <h1>Error</h1>
            Cannot load orders, please try again.
          </Modal>
        ) : (
          <>
            <Heading style={{ justifySelf: 'center' }}>Your Orders</Heading>
            <RenderedOrdersContainer>{renderedOrders}</RenderedOrdersContainer>
          </>
        )
      ) : (
        notAuth
      )}
    </Main>
  );
};

export default Orders;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr min(60ch, 100%) 1fr;
  grid-gap: 15px 0;
`;

const Heading = styled.h1`
  grid-column: 2/3;
  margin-bottom: 0;
`;

const RenderedOrdersContainer = styled.div`
  grid-column: 2/3;
`;

const OrderContainer = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 20px 0;

  &:nth-child(1) {
    margin-top: 0;
  }
`;

const TopRowContainer = styled.div`
  grid-column: 2/3;
  display: flex;
  background: #f6f6f6;
  z-index: 199;
  position: relative;
  justify-content: space-around;
  padding: 0;

  @media (min-width: 768px) {
    justify-content: space-between;
    padding: 0 2rem;
  }
`;

const Paragraph = styled.p`
  display: flex;
  flex-flow: column;
  &:hover div,
  &:active div {
    display: block;
  }
`;

const PopoverContainer = styled.div`
  display: none;
  position: absolute;
  z-index: 200;
  background: #fff;
  padding: 1rem;
  width: max-content;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 1px solid #f6f6f6;
  border-radius: 4px;
  justify-self: flex-end;
  top: 60px;
`;

const PopoverParagraph = styled.p`
  margin: 0;
`;

const DeliveryHeading = styled.h2`
  margin-left: 2rem;
`;

const ProductContainer = styled.div`
  grid-column: 2/3;
  display: grid;
  grid-template-columns: 10rem 1fr 1fr;
  grid-gap: 15px;
  padding: 2rem;
  width: 70%;
`;

const Image = styled.img`
  max-width: 10rem;
  grid-column: 1/2;
  grid-row: 1/4;
`;

const Title = styled(Link)`
  grid-column: 2/4;
  grid-row: 1/2;
  font-weight: bold;
  font-size: 20px;
  color: #3f6cd7;
  text-decoration: none;
  width: auto;

  @media (min-width: 768px) {
    width: max-content;
  }
`;

const Price = styled.p`
  grid-column: 2/3;
  font-weight: bold;
`;

const Quantity = styled.p`
  grid-column: 3/4;
  font-weight: bold;
  width: max-content;
`;

const UnauthorizedHeading = styled.h2`
  grid-column: 2/3;
  place-self: center;
  width: max-content;
`;

const SignInButton = styled(Button)`
  grid-column: 2/3;
  width: max-content;
  padding: 1rem;
  place-self: center;
`;

const ExtendedLink = styled(Link)`
  color: #3f6cd7;
  text-decoration: none;
`;
