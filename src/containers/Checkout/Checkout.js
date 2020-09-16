import React, { useState } from 'react';
import styled from 'styled-components';

import { Input } from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const CheckoutForm = () => {
  const [name, setName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [streetAddressTwo, setStreetAddressTwo] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <main>
      <h1>Shipping Information</h1>
      <StyledForm onSubmit='do something'>
        <Input
          type='text'
          value={name}
          name='name'
          changed={e => setName(e.target.value)}
          label='Name'
        />
        <Input
          type='text'
          value={streetAddress}
          name='streetAddress'
          changed={e => setStreetAddress(e.target.value)}
          label='Street Address 1'
        />
        <Input
          type='text'
          value={streetAddressTwo}
          name='streetAddressTwo'
          changed={e => setStreetAddressTwo(e.target.value)}
          label='Street Address 2'
        />
        <Input
          type='text'
          value={city}
          name='city'
          changed={e => setCity(e.target.value)}
          label='City'
        />
        <Input
          type='text'
          value={province}
          name='province'
          changed={e => setProvince(e.target.value)}
          label='Province'
        />
        <Input
          type='text'
          value={country}
          name='country'
          changed={e => setCountry(e.target.value)}
          label='Country'
        />
        <Input
          type='text'
          value={postalCode}
          name='postalCode'
          changed={e => setPostalCode(e.target.value)}
          label='Postal Code'
        />
        <Input
          type='text'
          value={phoneNumber}
          name='phoneNumber'
          changed={e => setPhoneNumber(e.target.value)}
          label='Primary Phone Number'
        />
        <Button>Continue</Button>
      </StyledForm>
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
