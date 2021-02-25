import React, { FormEvent, useState, useEffect, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// import useFetch from '../hooks/useFetch';
import Modal from './Modal';
import CartContext from '../context/cartContext';
import classes from '../css/CheckoutForm.module.css';

interface StripeFormProps {
  shippingSpeed: 'normal' | 'fast';
  formValues: {
    firstName: string;
    lastName: string;
    streetAddress: string;
    streetAddressTwo: string;
    city: string;
    province: string;
    postalCode: string;
    phoneNumber: string;
  };
  totalPrice: string;
  className?: string;
}

const StripeForm: React.FC<StripeFormProps> = props => {
  const [error, setError] = useState<null | string>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [compState, setCompState] = useState<'Rendered' | 'Error' | 'Loading'>('Loading');
  const stripe = useStripe();
  const elements = useElements();
  const context = useContext(CartContext);

  useEffect(() => {
    setCompState('Loading');
    const userId = localStorage.getItem('userId');
    const cart = JSON.parse(sessionStorage.getItem('cart')!);
    axios
      .post('create-payment-intent', {
        userId,
        items: cart,
        shippingSpeed: props.shippingSpeed,
        formValues: props.formValues
      })
      .then(res => {
        setClientSecret(res.data.clientSecret);
        setCompState('Rendered');
      })
      .catch(err => {
        console.error(err.response.data);
        setCompState('Error');
      });
  }, [props.formValues, props.shippingSpeed]);

  const orderHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProcessing(true);

    if (stripe && elements) {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!
        },
        shipping: {
          address: {
            line1: props.formValues.streetAddress,
            line2: props.formValues.streetAddressTwo,
            city: props.formValues.city,
            country: 'CA',
            postal_code: props.formValues.postalCode,
            state: props.formValues.province
          },
          name: props.formValues.firstName + ' ' + props.formValues.lastName,
          phone: props.formValues.phoneNumber
        }
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        const userId = localStorage.getItem('userId');
        const cart = JSON.parse(sessionStorage.getItem('cart')!);
        let totalPrice;
        if (payload.paymentIntent?.amount)
          totalPrice = payload.paymentIntent?.amount / 100;
        axios
          .post('/order', {
            userId,
            cart,
            shippingSpeed: props.shippingSpeed,
            orderData: props.formValues,
            totalPrice: totalPrice
          })
          .then(() => {
            setProcessing(false);
            setSucceeded(true);
            context.updateQuantity(null);
            sessionStorage.removeItem('cart');
          })
          .catch(err => {
            console.error(err.response.data);
          });
      }
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: '#000',
        fontFamily: 'Roboto Mono, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#000'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  return (
    <div className={props.className}>
      {compState === 'Error' && (
        <Modal show={compState === 'Error'}>Cannot place order. Please try again.</Modal>
      )}
      {compState === 'Rendered' && (
        <>
          <Form id='payment-form' onSubmit={orderHandler}>
            <div style={{ padding: '3px' }}>
              <CardElement id='card-element' options={cardStyle} />
            </div>
            <button className={classes.Button} id='submit'>
              <span id='button-text'>
                {processing ? (
                  <div className={classes.spinner} id='spinner'></div>
                ) : (
                  `Pay $${props.totalPrice}`
                )}
              </span>
            </button>
            {error && (
              <div className={classes.cardError} role='alert'>
                {error}
              </div>
            )}
          </Form>
          <p>use 4000 0012 4000 0000 to test it!</p>
        </>
      )}
      <>
        {succeeded && (
          <Modal show={succeeded}>
            <h2>Finished</h2>
            Order completed. Click <ExtendedLink to='/'>here</ExtendedLink> to return
            home!
          </Modal>
        )}
      </>
    </div>
  );
};

export default StripeForm;

const Form = styled.form`
  background-color: #def7ff;
  border: 0;
  border-radius: 7px;
`;

const ExtendedLink = styled(Link)`
  color: #3f6cd7;
`;
