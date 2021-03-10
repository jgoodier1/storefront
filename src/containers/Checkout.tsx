import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import styled from 'styled-components';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { Input } from '../components/Input';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import Select from '../components/Select';
import OrderSummary from '../components/OrderSummary';
import Modal from '../components/Modal';
import StripeForm from '../components/StripeForm';
import { selectAuthState, showModal } from '../reduxSlices/authSlice';

dayjs.extend(localizedFormat);

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

const Checkout: React.FC = () => {
  const [compState] = useState<'Loading' | 'Rendered' | 'Error'>('Rendered');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [shippingSpeed, setShippingSpeed] = useState<'normal' | 'fast'>(/**/ 'normal');
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectAuthState);

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
      step === 1 ? setStepTwoTrue(values) : setStep(3);
    },
    validationSchema: checkoutSchema
  });

  const [formValues, setFormValues] = useState(formik.initialValues);

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

  const cancelHandler = () => {
    setStep(1);
    history.push('/cart');
  };

  const setStepTwoTrue = (values: MyFormValues) => {
    setFormValues(values);
    setStep(2);
  };

  const shippingSpeedChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === 'fast' || e.currentTarget.value === 'normal')
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

  if ((step === 2 || step === 3) && shippingSpeed === 'fast') {
    shippingPrice = SHIPPING_PRICE[0].toFixed(2);
    totalPrice += +shippingPrice;
  } else if ((step === 2 || step === 3) && shippingSpeed === 'normal' && subTotal > 35) {
    shippingPrice = 'FREE';
    totalPrice = subTotal + tax;
  } else if ((step === 2 || step === 3) && shippingSpeed === 'normal' && subTotal < 35) {
    shippingPrice = SHIPPING_PRICE[1].toFixed(2);
    totalPrice += +shippingPrice;
  }

  const shippingLabelFast = `$10 -- Delivered By ${dayjs().add(3, 'day').format('LL')}`;
  const shippingLabelNormal = `${
    subTotal > 35 ? 'FREE' : '$5'
  } -- Delivered By ${dayjs().add(4, 'day').format('LL')}`;

  let renderedForm = <Spinner />;
  if (compState === 'Rendered' && step === 1) {
    renderedForm = (
      <>
        <FirstName
          type='text'
          name='firstName'
          id='firstName'
          label='First Name*'
          changed={formik.handleChange}
          value={formik.values.firstName}
          onBlur={formik.handleBlur}
        />
        <LastName
          type='text'
          name='lastName'
          id='lastName'
          label='Last Name*'
          changed={formik.handleChange}
          value={formik.values.lastName}
          onBlur={formik.handleBlur}
        />
        <Address1
          type='text'
          name='streetAddress'
          id='streetAddress'
          label='Street Address 1*'
          changed={formik.handleChange}
          value={formik.values.streetAddress}
          onBlur={formik.handleBlur}
        />
        <Address2
          type='text'
          name='streetAddressTwo'
          id='streetAddressTwo'
          label='Street Address 2'
          changed={formik.handleChange}
          value={formik.values.streetAddressTwo}
          onBlur={formik.handleBlur}
        />
        <City
          type='text'
          name='city'
          id='city'
          label='City*'
          changed={formik.handleChange}
          value={formik.values.city}
          onBlur={formik.handleBlur}
        />
        <Province htmlFor='province'>
          Province*
          <ExtendedSelect
            options={PROVINCES}
            name='province'
            value={formik.values.province}
            changed={formik.handleChange}
            // onBlur here?
          />
        </Province>
        <Country>
          Country* <CountrySpan>Canada</CountrySpan>
        </Country>
        <PostalCode
          type='text'
          name='postalCode'
          id='postalCode'
          label='Postal Code*'
          changed={formik.handleChange}
          value={formik.values.postalCode}
          onBlur={formik.handleBlur}
        />
        <PhoneNumber
          type='text'
          name='phoneNumber'
          id='phoneNumber'
          label='Primary Phone Number*'
          changed={formik.handleChange}
          value={formik.values.phoneNumber}
          onBlur={formik.handleBlur}
        />

        {formik.errors.firstName && formik.touched.firstName ? (
          <p>{formik.errors.firstName}</p>
        ) : null}
        {formik.errors.lastName && formik.touched.lastName ? (
          <p>{formik.errors.lastName}</p>
        ) : null}
        {formik.errors.streetAddress && formik.touched.streetAddress ? (
          <p>{formik.errors.streetAddress}</p>
        ) : null}
        {formik.errors.streetAddressTwo && formik.touched.streetAddressTwo ? (
          <p>{formik.errors.streetAddressTwo}</p>
        ) : null}
        {formik.errors.city && formik.touched.city ? <p>{formik.errors.city}</p> : null}
        {formik.errors.province && formik.touched.province ? (
          <p>{formik.errors.province}</p>
        ) : null}
        {formik.errors.postalCode && formik.touched.postalCode ? (
          <p>{formik.errors.postalCode}</p>
        ) : null}
        {formik.errors.phoneNumber && formik.touched.phoneNumber ? (
          <p>{formik.errors.phoneNumber}</p>
        ) : null}
      </>
    );
  } else if (compState === 'Rendered' && step === 2) {
    renderedForm = (
      <>
        <RadioContainer>
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
        </RadioContainer>
        <RadioContainer>
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
        </RadioContainer>
      </>
    );
  } else if (compState === 'Rendered' && step === 3) {
    renderedForm = <div></div>;
  }

  const notAuth = (
    <>
      <h2 style={{ placeSelf: 'center' }}>Please sign in to continue</h2>
      <SignInButton clicked={() => dispatch(showModal())}>Sign In</SignInButton>
    </>
  );

  return (
    <Main>
      {compState === 'Error' && (
        <Modal show={compState === 'Error'}>Cannot place order. Please try again.</Modal>
      )}
      {isLoggedIn ? (
        <>
          <h1>
            {step === 1 ? 'Shipping Address' : step === 2 ? 'Shipping Speed' : 'Payment'}
          </h1>
          {step === 3 && (
            <ExtendedStripeForm
              formValues={formValues}
              shippingSpeed={'normal'}
              totalPrice={totalPrice.toFixed(2)}
            />
          )}
          <Form onSubmit={formik.handleSubmit}>
            {renderedForm}
            <ExtendedOrderSummary
              totalPrice={totalPrice.toFixed(2)}
              tax={tax.toFixed(2)}
              subTotal={subTotal.toFixed(2)}
              shippingPrice={shippingPrice}
            />
            <ButtonContainer>
              {step !== 3 && <ExtendedButton type='submit'>Continue</ExtendedButton>}
              <ExtendedButton clicked={cancelHandler}>Cancel</ExtendedButton>
            </ButtonContainer>
          </Form>
        </>
      ) : (
        notAuth
      )}
    </Main>
  );
};

export default Checkout;

const Main = styled.main`
  display: grid;
  grid-template-columns: 2fr 1fr;
  margin: 1rem 6rem;

  @media (max-width: 768px) {
    margin: 1rem;
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;

const ExtendedStripeForm = styled(StripeForm)`
  grid-column: 1/2;
  grid-row: 2/3;
  width: max-content;
  z-index: 400;
`;

const Form = styled.form`
  grid-column: 1/2;
  grid-row: 2/5;
  display: grid;
  grid-template-columns: repeat(3, 20rem);
  grid-template-rows: 4rem;
  grid-gap: 10px;
  max-width: max-content;
  height: max-content;
  text-align: left;
  padding: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 0;
    margin: 20px 0;
  }
`;

const FirstName = styled(Input)`
  grid-column: 1/2;
  grid-row: 1/2;
`;

const LastName = styled(Input)`
  grid-column: 2/3;
  grid-row: 1/2;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 2/3;
  }
`;

const Address1 = styled(Input)`
  grid-column: 1/3;
  grid-row: 2/3;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 3/4;
  }
`;

const Address2 = styled(Input)`
  grid-column: 1/3;
  grid-row: 3/4;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 4/5;
  }
`;

const City = styled(Input)`
  grid-column: 1/3;
  grid-row: 4/5;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 5/6;
  }
`;

const Province = styled.label`
  grid-column: 1/2;
  grid-row: 5/6;
  font-weight: bold;

  @media (max-width: 768px) {
    grid-row: 6/7;
  }
`;

const ExtendedSelect = styled(Select)`
  & {
    border: 1px solid #000;
    width: 20rem;

    @media (max-width: 768px) {
      width: auto;
    }
  }
`;

const PostalCode = styled(Input)`
  grid-column: 2/3;
  grid-row: 5/6;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 7/8;
  }
`;

const Country = styled.p`
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

const CountrySpan = styled.span`
  height: 34px;
  border: 1px solid black;
  padding-left: 0.5em;
  padding-top: 5px;
  font-size: inherit;
  font-weight: normal;
`;

const PhoneNumber = styled(Input)`
  grid-column: 2/3;
  grid-row: 6/7;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 9/10;
  }
`;

const ExtendedOrderSummary = styled(OrderSummary)`
  grid-column: 3/4;
  grid-row: 1/4;
  align-self: start;
  margin-left: 1rem;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 10/11;
    align-self: center;
    margin: 0;
  }
`;

const ButtonContainer = styled.div`
  grid-column: 3/4;
  grid-row: 3/8;
  display: flex;
  flex-flow: column;
  margin-left: 1rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: 11/12;
    align-items: center;
    margin: 0;
  }
`;

const ExtendedButton = styled(Button)`
  width: max-content;
  height: max-content;
  padding: 1.5rem;
  font-weight: bold;
  font-size: 1.5rem;
  font-family: inherit;
  margin-top: 20px;

  @media (max-width: 768px) {
  }
`;

const RadioContainer = styled.div`
  grid-column: 1/3;
  height: max-content;
`;

const SignInButton = styled(Button)`
  grid-row: 2;
  width: max-content;
  padding: 1rem;
  place-self: center;
`;
