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
  // const history = useHistory();

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
        console.log(res.data);
        setClientSecret(res.data.clientSecret);
        setCompState('Rendered');
      })
      .catch(err => {
        console.log(err);
        setCompState('Error');
      });
  }, [props.formValues, props.shippingSpeed]);

  const orderHandler = async (e: FormEvent<HTMLFormElement>) => {
    console.log('hellooooo');
    e.preventDefault();
    setProcessing(true);

    if (stripe && elements) {
      const payload = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!
        }
      });

      if (payload.error) {
        setError(`Payment failed: ${payload.error.message}`);
        setProcessing(false);
      } else {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        console.log('succeeded');
        context.updateQuantity(null);
        sessionStorage.removeItem('cart');
        // history.push('/');
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
          <StyledForm id='payment-form' onSubmit={orderHandler}>
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
          </StyledForm>
          <p>use 4000 0012 4000 0000 to test it!</p>
        </>
      )}
      <>
        {succeeded && (
          <Modal show={succeeded}>
            <h2>Finished</h2>
            Order completed. Click <StyledLink to='/'>here</StyledLink> to return home!
          </Modal>
        )}
      </>
    </div>
  );
};

export default StripeForm;

const StyledForm = styled.form`
  background-color: #def7ff;
  border: 0;
  border-radius: 7px;
`;

const StyledLink = styled(Link)`
  color: #3f6cd7;
`;
