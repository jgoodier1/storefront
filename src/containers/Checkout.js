import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Input } from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Select from '../components/Select';
import OrderSummary from '../components/OrderSummary';
import CartContext from '../context/cartContext';

dayjs.extend(localizedFormat);

const Checkout = () => {
  // make sure they're logged in first!!!!
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [streetAddressTwo, setStreetAddressTwo] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [shippingSpeed, setShippingSpeed] = useState('normal');

  const context = useContext(CartContext);
  const history = useHistory();

  const PROVINCES = [
    '',
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Northwest Territories',
    'Nova Scotia',
    'Nunavut',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Yukon'
  ];
  const SHIPPING_PRICE = [10, 5];

  const cart = JSON.parse(sessionStorage.getItem('cart'));
  console.log(cart);

  const orderHandler = e => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId');
    // not actually using currentDate on back-end, just using Mongo timestampss
    // const currentDate = new Date();
    const orderData = {
      firstName,
      lastName,
      streetAddress,
      streetAddressTwo,
      city,
      province,
      country: 'Canada',
      postalCode,
      phoneNumber
    };
    const order = { cart, orderData, userId, shippingSpeed, totalPrice };
    axios
      .post('/order', order)
      .then(res => {
        setLoading(false);
        setStepTwo(false);
        context.updateQuantity(null);
        sessionStorage.removeItem('cart');
        history.push('/');
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };

  const cancelHandler = () => {
    setStepTwo(false);
    history.push('/cart');
  };

  const setStepTwoTrue = () => {
    // check to see that everything is valid
    setStepTwo(true);
  };

  const shippingSpeedChangeHandler = e => {
    setShippingSpeed(e.target.value);
  };

  let shippingLabelFast = `Fast -- Delivered By ${dayjs().add(3, 'day').format('LL')}`;
  let shippingLabelNormal = `Normal -- Delivered By ${dayjs()
    .add(4, 'day')
    .format('LL')}`;

  const subTotal = cart.subTotal;
  let tax;
  switch (province) {
    case 'Alberta':
      tax = subTotal * 0.05;
      break;
    case 'British Columbia':
      tax = subTotal * 0.12;
      break;
    case 'Manitoba':
      tax = subTotal * 0.12;
      break;
    case 'New Brunswick':
      tax = subTotal * 0.15;
      break;
    case 'Newfoundland and Labrador':
      tax = subTotal * 0.15;
      break;
    case 'Northwest Territories':
      tax = subTotal * 0.05;
      break;
    case 'Nova Scotia':
      tax = subTotal * 0.15;
      break;
    case 'Nunavut':
      tax = subTotal * 0.05;
      break;
    case 'Ontario':
      tax = subTotal * 0.13;
      break;
    case 'Prince Edward Island':
      tax = subTotal * 0.15;
      break;
    case 'Quebec':
      tax = subTotal * 0.14975;
      break;
    case 'Saskatchewan':
      tax = subTotal * 0.11;
      break;
    case 'Yukon':
      tax = subTotal * 0.05;
      break;
    default:
      tax = 0;
      break;
  }

  let totalPrice = subTotal + tax;
  let shippingPrice = subTotal > 35 ? 'FREE' : 'TBD';

  if (stepTwo && shippingSpeed === 'fast') {
    shippingPrice = SHIPPING_PRICE[0].toFixed(2);
    totalPrice += +shippingPrice;
  } else if (stepTwo && shippingSpeed === 'normal' && subTotal > 35) {
    shippingPrice = 'FREE';
    totalPrice = subTotal + tax;
  } else if (stepTwo && shippingSpeed === 'normal' && subTotal < 35) {
    shippingPrice = SHIPPING_PRICE[1].toFixed(2);
    totalPrice += +shippingPrice;
  }

  let renderedForm = <Spinner />;
  if (!loading && !stepTwo) {
    renderedForm = (
      <>
        {/* <h2>Shipping Address</h2> */}
        <StyledForm>
          <StyledFirstName
            type='text'
            value={firstName}
            name='firstName'
            id='firstName'
            changed={e => setFirstName(e.target.value)}
            label='First Name*'
          />
          <StyledLastName
            type='text'
            value={lastName}
            name='lastName'
            id='lastName'
            changed={e => setLastName(e.target.value)}
            label='Last Name*'
          />
          <StyledAddress1
            type='text'
            value={streetAddress}
            name='streetAddress'
            id='streetAddress'
            changed={e => setStreetAddress(e.target.value)}
            label='Street Address 1*'
          />
          <StyledAddress2
            type='text'
            value={streetAddressTwo}
            name='streetAddressTwo'
            id='streetAddressTwo'
            changed={e => setStreetAddressTwo(e.target.value)}
            label='Street Address 2'
          />
          <StyledCity
            type='text'
            value={city}
            name='city'
            id='city'
            changed={e => setCity(e.target.value)}
            label='City*'
          />
          <StyledProvince htmlFor='provinces'>
            Province*
            <StyledSelect
              options={PROVINCES}
              changed={e => setProvince(e.target.value)}
              // name='provinces'
            />
          </StyledProvince>
          <StyledCountry>
            Country* <StyledSpan>Canada</StyledSpan>
          </StyledCountry>
          <StyledPostalCode
            type='text'
            value={postalCode}
            name='postalCode'
            id='postalCode'
            changed={e => setPostalCode(e.target.value)}
            label='Postal Code*'
          />
          <StyledPhoneNumber
            type='text'
            value={phoneNumber}
            name='phoneNumber'
            id='phoneNumber'
            changed={e => setPhoneNumber(e.target.value)}
            label='Primary Phone Number*'
          />
        </StyledForm>
      </>
    );
  } else if (!loading && stepTwo) {
    renderedForm = (
      <>
        {/* <h2>Select a shipping speed</h2> */}
        <StyledForm>
          <Input
            type='radio'
            name='shipping'
            id='fast'
            value='fast'
            label={shippingLabelFast}
            checked={shippingSpeed === 'fast'}
            changed={shippingSpeedChangeHandler}
          />
          <Input
            type='radio'
            name='shipping'
            id='normal'
            value='normal'
            label={shippingLabelNormal}
            checked={shippingSpeed === 'normal'}
            changed={shippingSpeedChangeHandler}
          />
        </StyledForm>
      </>
    );
  }

  return (
    <StyledMain>
      <h2>{!stepTwo ? 'Shipping Address' : 'Shipping Speed'}</h2>
      {renderedForm}
      <StyledOrderSummary
        totalPrice={totalPrice.toFixed(2)}
        tax={tax.toFixed(2)}
        subTotal={subTotal.toFixed(2)}
        shippingPrice={shippingPrice}
      />
      <StyledBttnDiv>
        <StyledButton clicked={!stepTwo ? setStepTwoTrue : e => orderHandler(e)}>
          {!stepTwo ? 'Continue' : 'Place Order'}
        </StyledButton>
        <StyledButton clicked={cancelHandler}>Cancel</StyledButton>
      </StyledBttnDiv>
    </StyledMain>
  );
};

export default Checkout;

const StyledMain = styled.main`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 1rem 6rem;

  @media (max-width: 768px) {
    margin: 1rem;
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const StyledOrderSummary = styled(OrderSummary)`
  ${'' /* grid-column: 2/3; */}
  align-self: start;
  margin: 0;
`;

const StyledForm = styled.form`
  grid-column: 1/2;
  grid-row: 2/5;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  ${'' /* margin: 100px auto; */}
  max-width: max-content;
  text-align: left;
  border: 1px solid #eee;
  padding: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 0;
    margin: 20px 0;
  }
`;

const StyledFirstName = styled(Input)`
  grid-column: 1/2;
  grid-row: 1/2;
`;

const StyledLastName = styled(Input)`
  grid-column: 2/3;
  grid-row: 1/2;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 2/3;
  }
`;

const StyledAddress1 = styled(Input)`
  grid-column: 1/3;
  grid-row: 2/3;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 3/4;
  }
`;

const StyledAddress2 = styled(Input)`
  grid-column: 1/3;
  grid-row: 3/4;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 4/5;
  }
`;

const StyledCity = styled(Input)`
  grid-column: 1/3;
  grid-row: 4/5;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 5/6;
  }
`;

const StyledProvince = styled.label`
  grid-column: 1/2;
  grid-row: 5/6;
  font-weight: bold;

  @media (max-width: 768px) {
    grid-row: 6/7;
  }
`;

const StyledSelect = styled(Select)`
  border: 1px solid #000;
`;

const StyledPostalCode = styled(Input)`
  grid-column: 2/3;
  grid-row: 5/6;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 7/8;
  }
`;

const StyledCountry = styled.p`
  grid-column: 1/2;
  grid-row: 6/7;
  font-weight: bold;
  display: flex;
  flex-flow: column;
  margin: 0;

  @media (max-width: 768px) {
    grid-row: 8/9;
  }
`;

const StyledSpan = styled.span`
  height: 34px;
  border: 1px solid black;
  padding-left: 0.5em;
  padding-top: 5px;
  font-size: inherit;
  font-weight: normal;
`;

const StyledPhoneNumber = styled(Input)`
  grid-column: 2/3;
  grid-row: 6/7;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 9/10;
  }
`;

const StyledBttnDiv = styled.div`
  grid-column: 2/3;
  grid-row: 3/4;
  display: flex;
  flex-flow: column;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 6/7;
    align-items: center;
  }
`;

const StyledButton = styled(Button)`
  width: max-content;
  height: max-content;
  padding: 1.5rem;
  ${'' /* margin-left: 1rem; */}
  font-weight: bold;
  font-size: 1.5rem;
  font-family: inherit;
  margin-top: 20px;

  @media (max-width: 768px) {
  }
`;
