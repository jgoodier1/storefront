import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/Button/Button';

const CartItem = (props) => {
  const history = useHistory();

  const deleteHandler = () => {
    const deletedProduct = { id: props.id };
    axios
      .post('cart-delete', deletedProduct)
      .then((res) => {
        console.log('res.data', res.data);
        console.log('res', res);
      })
      .then(() => history.go(0))
      .catch((err) => console.error(err));
  };

  return (
    <StyledItemDiv>
      <StyledTitle>{props.title}</StyledTitle>
      <StyledImage src={props.image} alt={props.title} />
      <StyledPrice>${props.price}</StyledPrice>
      <StyledQuant>Quantity: {props.quantity}</StyledQuant>
      <Button clicked={deleteHandler}>Delete</Button>
    </StyledItemDiv>
  );
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/cart')
      .then((res) => {
        const fetchedProducts = [];
        for (let key in res.data) {
          fetchedProducts.push({
            ...res.data[key],
            id: key,
          });
        }
        setCart(fetchedProducts);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

  const orderHandler = () => {
    setLoading(true);
    const orderedCart = cart;
    axios
      .post('/order', orderedCart)
      .then((res) => {
        setLoading(false);
        console.log('res', res);
        console.log('res.data', res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  let renderedCart = <Spinner />;
  if (!loading) {
    renderedCart = cart.map((ci) => (
      <CartItem
        key={ci.prodId._id}
        title={ci.prodId.title}
        price={ci.prodId.price}
        image={ci.prodId.image}
        quantity={ci.quantity}
        id={ci.prodId._id}
      />
    ));
  }

  console.log('renderedCart', renderedCart);

  let totalPrice; // should probably handle prices on back-end (or at least validate them)
  if (renderedCart.length > 0) {
    const filteredPrices = renderedCart.map((obj) => obj.props.price);
    const filteredQuants = renderedCart.map((obj) => obj.props.quantity);
    const oneArray = filteredPrices.map((x, index) => x * filteredQuants[index]);
    totalPrice = oneArray.reduce((a, b) => a + b).toFixed(2);
  }

  return (
    <StyledCartDiv>
      {renderedCart}
      {totalPrice && <h2>Total Price: ${totalPrice}</h2>}
      {renderedCart.length > 0 ? (
        <StyledButton clicked={orderHandler}>Order</StyledButton>
      ) : (
        <h2>Cart is empty</h2>
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

const StyledButton = styled(Button)`
  align-self: center;
  grid-column: 2/3;
  grid-row: 1/2;
`;
