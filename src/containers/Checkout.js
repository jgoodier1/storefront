import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
//change moment to dayjs (it's smaller and already installed too)
// import moment from 'moment';
import dayjs from 'dayjs';

import { Input } from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';

const CheckoutForm = () => {
  const [name, setName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [streetAddressTwo, setStreetAddressTwo] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [shippingSpeed, setShippingSpeed] = useState('fastest');

  const history = useHistory();

  const orderHandler = e => {
    e.preventDefault();
    setLoading(true);
    const userId = localStorage.getItem('userId');
    const orderedCart = JSON.parse(sessionStorage.getItem('cart'));
    const currentDate = dayjs().format('LL');
    const orderData = {
      name,
      streetAddress,
      streetAddressTwo,
      city,
      province,
      country,
      postalCode,
      phoneNumber
    };
    const order = { orderedCart, orderData, userId, shippingSpeed, currentDate };
    axios
      .post('/order', order)
      .then(res => {
        console.log(res.data);
        setLoading(false);
        setStepTwo(false);
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
    // history.push('/cart');
  };

  const setStepTwoTrue = () => {
    setStepTwo(true);
  };
  // const setStepTwoFalse = () => {
  //   setStepTwo(false);
  // };

  const shippingSpeedChangeHandler = e => {
    setShippingSpeed(e.target.value);
  };

  let shippingLabelFastest = `Fastest -- Delivered By ${dayjs()
    .add(2, 'day')
    .format('LL')}`;
  let shippingLabelNormal = `Normal -- Delivered By ${dayjs()
    .add(3, 'day')
    .format('LL')}`;
  let shippingLabelSlowest = `Slowest -- Delivered By ${dayjs()
    .add(4, 'day')
    .format('LL')}`;

  let renderedForm = <Spinner />;
  if (!loading && !stepTwo) {
    renderedForm = (
      <>
        <h2>Shipping Address</h2>
        <StyledForm>
          <Input
            type='text'
            value={name}
            name='name'
            id='name'
            changed={e => setName(e.target.value)}
            label='Name'
          />
          <Input
            type='text'
            value={streetAddress}
            name='streetAddress'
            id='streetAddress'
            changed={e => setStreetAddress(e.target.value)}
            label='Street Address 1'
          />
          <Input
            type='text'
            value={streetAddressTwo}
            name='streetAddressTwo'
            id='streetAddressTwo'
            changed={e => setStreetAddressTwo(e.target.value)}
            label='Street Address 2'
          />
          <Input
            type='text'
            value={city}
            name='city'
            id='city'
            changed={e => setCity(e.target.value)}
            label='City'
          />
          <Input
            type='text'
            value={province}
            name='province'
            id='province'
            changed={e => setProvince(e.target.value)}
            label='Province'
          />
          <Input
            type='text'
            value={country}
            name='country'
            id='country'
            changed={e => setCountry(e.target.value)}
            label='Country'
          />
          <Input
            type='text'
            value={postalCode}
            name='postalCode'
            id='postalCode'
            changed={e => setPostalCode(e.target.value)}
            label='Postal Code'
          />
          <Input
            type='text'
            value={phoneNumber}
            name='phoneNumber'
            id='phoneNumber'
            changed={e => setPhoneNumber(e.target.value)}
            label='Primary Phone Number'
          />
          <Button clicked={cancelHandler}>Cancel</Button>
          <Button clicked={setStepTwoTrue}>Continue</Button>
        </StyledForm>
      </>
    );
  } else if (!loading && stepTwo) {
    renderedForm = (
      <>
        <h2>Select a shipping speed</h2>
        <StyledForm onSubmit={e => orderHandler(e)}>
          {/* Shipping info */}
          <Input
            type='radio'
            name='shipping'
            id='fastest'
            value='fastest'
            label={shippingLabelFastest}
            checked={shippingSpeed === 'fastest'}
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
          <Input
            type='radio'
            name='shipping'
            id='slowest'
            value='slowest'
            label={shippingLabelSlowest}
            checked={shippingSpeed === 'slowest'}
            changed={shippingSpeedChangeHandler}
          />
          <Button clicked={cancelHandler}>Cancel</Button>
          <Button>Continue</Button>
        </StyledForm>
      </>
    );
  }

  return (
    <main>
      <h1>Shipping Information</h1>
      {renderedForm}
    </main>
  );
};

const Checkout = () => {
  return <CheckoutForm />;
};

export default Checkout;

const StyledForm = styled.form`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;
  margin: 100px auto;
  width: 500px;
  text-align: center;
  ${'' /* box-shadow: 0 2px 3px #ccc; */}
  border: 1px solid #eee;
  padding: 10px;
`;

/**
 * Get shipping info (location)
 * Ask shipping speed (make a couple dummy options)
 * Review detail (summary of everything on one screen)
 * Send them to stripe
 * Log order in DB
 */
