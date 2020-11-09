import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Spinner from '../components/Spinner';
import Button from '../components/Button';

const CartItem = props => {
  return (
    <StyledItemDiv>
      <StyledTitle>{props.title}</StyledTitle>
      <StyledImage src={props.image} alt={props.title} />
      <StyledPrice>${props.price}</StyledPrice>
      <StyledQuant>Quantity: {props.quantity}</StyledQuant>
      <Button clicked={() => props.delete(props.id)}>Delete</Button>
    </StyledItemDiv>
  );
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  console.log(cart);

  useEffect(() => {
    setLoading(true);
    let cartFromStorage = JSON.parse(sessionStorage.getItem('cart'));
    console.log(cartFromStorage);
    if (cartFromStorage === null) {
      cartFromStorage = []
    }
    if (cartFromStorage.length !== 0) {
      axios
        .post('/cart', cartFromStorage)
        .then(res => {
          setCart(res.data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.response.data.message);
          setLoading(false);
        });
    }
  }, []);

  const deleteHandler = id => {
    setLoading(true);
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    if (cart === undefined) {
      console.log('cart undefined');
      return; // return some kind of error
    }
    const existingProdId = cart.products.find(p => p.prodId === id);
    if (!existingProdId) {
      console.log('no existing prod id');
      setLoading(false);
      return; // need another error
    } else {
      let subTotal = 0;
      cart.products.forEach(p => {
        subTotal += p.quantity * p.price;
      });
      const newCart = {
        ...cart,
        products: cart.products.filter(p => p.prodId !== id),
        subTotal
      };
      if (newCart.products.length < 1) {
        sessionStorage.removeItem('cart');
        setCart([]);
      } else {
        sessionStorage.setItem('cart', JSON.stringify(newCart));
      }
      axios
        .post('/cart', newCart)
        .then(res => {
          setCart(res.data);
          setLoading(false);
          console.log(res);
        })
        .catch(err => {
          setError(err.response.data.message);
          console.log(err.response.data.message);
          setLoading(false);
        });
    }
  };

  let renderedCart = <Spinner />;
  if (cart !== undefined && !loading) {
    renderedCart = cart.map(ci => (
      <CartItem
        key={ci.prodId}
        title={ci.title}
        price={ci.price}
        image={ci.image}
        quantity={ci.quantity}
        delete={deleteHandler}
        id={ci.prodId}
      />
    ));
  } else if (cart.length === 0) {
    setLoading(false)
    renderedCart = <h1>Cart is empty</h1>
  }

  let totalPrice; // should probably handle prices on back-end (or at least validate them)
  if (renderedCart.length > 0) {
    const filteredPrices = renderedCart.map(obj => obj.props.price);
    const filteredQuants = renderedCart.map(obj => obj.props.quantity);
    const oneArray = filteredPrices.map((x, index) => x * filteredQuants[index]);
    totalPrice = oneArray.reduce((a, b) => a + b).toFixed(2);
  }

  return (
    <StyledCartDiv>
      {error !== '' && <h2>{error}</h2>}
      {renderedCart}
      {totalPrice && <h2>Total Price: ${totalPrice}</h2>}
      {renderedCart.length > 0 && (
        <StyledLink to='/checkout'>Continue to Checkout</StyledLink>
      )}
    </StyledCartDiv>
  );
};

export default Cart;

const StyledCartDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  margin: 15px;
`;

const StyledItemDiv = styled.div`
  grid-column: 1/2;
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: repeat(5, auto);
  align-content: start;
  justify-content: space-between;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  margin-bottom: 1rem;
  background-color: white;
`;

const StyledTitle = styled.h2`
  margin-right: 1rem;
  font-size: 1.2rem;
  margin: 0;
  justify-self: start;
  grid-column: 2/3;
  align-self: start;
  padding-top: 0.6rem;
`;

const StyledImage = styled.img`
  grid-column: 1/2;
  grid-row: 1/6;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 150px;
`;

const StyledPrice = styled.h2`
  margin-right: 1rem;
  font-size: 1.2rem;
  margin: 0;
  align-self: start;
  justify-self: end;
`;

const StyledQuant = styled.h3`
  margin-right: 1rem;
  font-size: 1.2rem;
  margin: 0;
  justify-self: start;
  grid-column: 2/3;
  align-self: start;
  padding-top: 0.6rem;
`;

const StyledLink = styled(Link)`
  align-self: center;
  grid-column: 2/3;
  grid-row: 1/2;
  padding: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  background-color: white;
  border: 3px solid #38689e;
  color: #38689e;
  text-decoration: none;
`;

// const deletedProduct = { id: props.id };
// axios
//   .post('cart-delete', deletedProduct)
//   .then(res => {
//     console.log('res.data', res.data);
//     console.log('res', res);
//   })
//   .then(() => history.go(0))
//   .catch(err => console.error(err));

// useEffect(() => {
//   setLoading(true);
//   axios
//     .get('/cart')
//     .then((res) => {
//       const fetchedProducts = [];
//       for (let key in res.data) {
//         fetchedProducts.push({
//           ...res.data[key],
//           id: key,
//         });
//       }
//       setCart(fetchedProducts);
//       setLoading(false);
//     })
//     .catch((err) => {
//       setLoading(false);
//       console.error(err);
//     });
// }, []);

// const orderHandler = () => {
//   setLoading(true);
//   const orderedCart = cart;
//   axios
//     .post('/order', orderedCart)
//     .then(res => {
//       setLoading(false);
//       console.log('res', res);
//       console.log('res.data', res.data);
//     })
//     .catch(err => {
//       setLoading(false);
//       console.log(err);
//     });
// };

// const deleteHandler = () => {
//   const cart = JSON.parse(sessionStorage.getItem('cart'));
//   if (cart === undefined) {
//     console.log('cart undefined');
//     return; // return some kind of error
//   }
//   const existingProdId = cart.products.find(p => p.prodId === props.id);
//   if (!existingProdId) {
//     console.log('no existing prod id');
//     return; // need another error
//   } else {
//     let subTotal = 0;
//     cart.products.forEach(p => {
//       subTotal += p.quantity * p.price;
//     });
//     const newCart = {
//       ...cart,
//       products: cart.products.filter(p => p.prodId !== props.id),
//       subTotal
//     };
//     console.log(newCart);
//     sessionStorage.setItem('cart', JSON.stringify(newCart));
//   }
// };
