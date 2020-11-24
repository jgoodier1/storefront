import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
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

interface CheckoutProps {
  isLoggedIn: boolean;
  showModal: () => void;
}

interface MyFormValues {
  firstName: string;
  lastName: string;
  streetAddress: string;
  streetAddressTwo: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
}

const Checkout = (props: CheckoutProps) => {
  const [loading, setLoading] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [shippingSpeed, setShippingSpeed] = useState('normal');
  const [formValues, setFormValues] = useState({});

  const context = useContext(CartContext);
  const history = useHistory();

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().trim().required('First Name is required').max(20).min(2),
    lastName: yup.string().trim().required('Last Name is required').max(20).min(2),
    streetAddress: yup
      .string()
      .trim()
      .required('Street Address is required')
      .max(50)
      .min(2),
    // .matches(streetRegex, 'Street Address is not Valid'), // validate as adress somehow
    streetAddress2: yup.string().trim().max(20).min(2),
    city: yup.string().trim().min(2).max(50).required('City is required'),
    province: yup.string().trim().required('Province is required'),
    postalCode: yup
      .string()
      .trim()
      .required('Postal Code is required')
      .matches(
        /([ABCEGHJKLMNPRSTVXY][0-9][ABCEGHJKLMNPRSTVWXYZ]) ?([0-9][ABCEGHJKLMNPRSTVWXYZ][0-9])/,
        'Postal Code is not valid'
      ),
    phoneNumber: yup
      .string()
      .trim()
      .required('Phone Number is required')
      .matches(
        /^(?:\([2-9]\d{2}\) ?|[2-9]\d{2}(?:-?| ?))[2-9]\d{2}[- ]?\d{4}$/,
        'Phone Number is not valid'
      )
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      streetAddress: '',
      streetAddressTwo: '',
      city: '',
      province: '',
      postalCode: '',
      phoneNumber: ''
    },
    onSubmit(values) {
      !stepTwo ? setStepTwoTrue(values) : orderHandler();
    },
    validationSchema: checkoutSchema
  });

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

  const cart = JSON.parse(sessionStorage.getItem('cart')!);

  const orderHandler = () => {
    setLoading(true);
    const userId = localStorage.getItem('userId');
    // not actually using currentDate on back-end, just using Mongo timestampss
    // const currentDate = new Date();
    const order = { cart, orderData: formValues, userId, shippingSpeed, totalPrice };
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

  const setStepTwoTrue = (values: MyFormValues) => {
    setFormValues(values);
    setStepTwo(true);
  };

  const shippingSpeedChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setShippingSpeed(e.currentTarget.value);
  };

  const subTotal = cart.subTotal;
  let tax;

  switch (formik.values.province) {
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

  let shippingLabelFast = `$10 -- Delivered By ${dayjs().add(3, 'day').format('LL')}`;
  let shippingLabelNormal = `${
    subTotal > 35 ? 'FREE' : '$5'
  } -- Delivered By ${dayjs().add(4, 'day').format('LL')}`;

  let renderedForm = <Spinner />;
  if (!loading && !stepTwo) {
    renderedForm = (
      <>
        <StyledForm onSubmit={formik.handleSubmit}>
          <StyledFirstName
            type='text'
            name='firstName'
            id='firstName'
            label='First Name*'
            changed={formik.handleChange}
            value={formik.values.firstName}
            onBlur={formik.handleBlur}
          />
          <StyledLastName
            type='text'
            name='lastName'
            id='lastName'
            label='Last Name*'
            changed={formik.handleChange}
            value={formik.values.lastName}
            onBlur={formik.handleBlur}
          />
          <StyledAddress1
            type='text'
            name='streetAddress'
            id='streetAddress'
            label='Street Address 1*'
            changed={formik.handleChange}
            value={formik.values.streetAddress}
            onBlur={formik.handleBlur}
          />
          <StyledAddress2
            type='text'
            name='streetAddressTwo'
            id='streetAddressTwo'
            label='Street Address 2'
            changed={formik.handleChange}
            value={formik.values.streetAddressTwo}
            onBlur={formik.handleBlur}
          />
          <StyledCity
            type='text'
            name='city'
            id='city'
            label='City*'
            changed={formik.handleChange}
            value={formik.values.city}
            onBlur={formik.handleBlur}
          />
          <StyledProvince htmlFor='province'>
            Province*
            <StyledSelect
              options={PROVINCES}
              name='province'
              value={formik.values.province}
              changed={formik.handleChange}
              // onBlur here?
            />
          </StyledProvince>
          <StyledCountry>
            Country* <StyledSpan>Canada</StyledSpan>
          </StyledCountry>
          <StyledPostalCode
            type='text'
            name='postalCode'
            id='postalCode'
            label='Postal Code*'
            changed={formik.handleChange}
            value={formik.values.postalCode}
            onBlur={formik.handleBlur}
          />
          <StyledPhoneNumber
            type='text'
            name='phoneNumber'
            id='phoneNumber'
            label='Primary Phone Number*'
            changed={formik.handleChange}
            value={formik.values.phoneNumber}
            onBlur={formik.handleBlur}
          />
          <StyledButton>Continue</StyledButton>
          {formik.errors.firstName && formik.touched.firstName ? (
            <div>{formik.errors.firstName}</div>
          ) : null}
          {formik.errors.lastName && formik.touched.lastName ? (
            <div>{formik.errors.lastName}</div>
          ) : null}
          {formik.errors.streetAddress && formik.touched.streetAddress ? (
            <div>{formik.errors.streetAddress}</div>
          ) : null}
          {formik.errors.streetAddressTwo && formik.touched.streetAddressTwo ? (
            <div>{formik.errors.streetAddressTwo}</div>
          ) : null}
          {formik.errors.city && formik.touched.city ? (
            <div>{formik.errors.city}</div>
          ) : null}
          {formik.errors.province && formik.touched.province ? (
            <div>{formik.errors.province}</div>
          ) : null}
          {formik.errors.postalCode && formik.touched.postalCode ? (
            <div>{formik.errors.postalCode}</div>
          ) : null}
          {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
            <div>{formik.errors.phoneNumber}</div>
          ) : null}
        </StyledForm>
      </>
    );
  } else if (!loading && stepTwo) {
    renderedForm = (
      <>
        <StyledForm onSubmit={formik.handleSubmit}>
          <StyledRadioDiv>
            <input
              type='radio'
              name='shipping'
              id='fast'
              value='fast'
              checked={shippingSpeed === 'fast'}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                shippingSpeedChangeHandler(e)
              }
            />
            <label htmlFor='fast'>{shippingLabelFast}</label>
          </StyledRadioDiv>
          <StyledRadioDiv>
            <input
              type='radio'
              name='shipping'
              id='normal'
              value='normal'
              checked={shippingSpeed === 'normal'}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                shippingSpeedChangeHandler(e)
              }
            />
            <label htmlFor='normal'>{shippingLabelNormal}</label>
          </StyledRadioDiv>
          <StyledButton>Place Your Order</StyledButton>
        </StyledForm>
      </>
    );
  }

  const notAuth = (
    <>
      <h2 style={{ placeSelf: 'center' }}>Please sign in to continue</h2>
      <StyledAuthBttn clicked={props.showModal}>Sign In</StyledAuthBttn>
    </>
  );

  return (
    <StyledMain>
      {props.isLoggedIn ? (
        <>
          <h2>{!stepTwo ? 'Shipping Address' : 'Shipping Speed'}</h2>
          {renderedForm}
          <StyledOrderSummary
            totalPrice={totalPrice.toFixed(2)}
            tax={tax.toFixed(2)}
            subTotal={subTotal.toFixed(2)}
            shippingPrice={shippingPrice}
          />
          <StyledBttnDiv>
            {/* <StyledButton type='submit'>
              {!stepTwo ? 'Continue' : 'Place Order'}
            </StyledButton> */}
            <StyledButton clicked={cancelHandler}>Cancel</StyledButton>
          </StyledBttnDiv>
        </>
      ) : (
        notAuth
      )}
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
  grid-template-rows: 4rem;
  grid-gap: 10px;
  ${'' /* margin: 100px auto; */}
  max-width: max-content;
  height: max-content;
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

const StyledRadioDiv = styled.div`
  grid-column: 1/3;
  height: max-content;
`;

const StyledAuthBttn = styled(Button)`
  grid-row: 2;
  width: max-content;
  padding: 1rem;
  place-self: center;
`;
