import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Spinner from '../components/Spinner';
import Select from '../components/Select';
import CartContext from '../context/cartContext';
import OrderSummary from '../components/OrderSummary';

const CartItem = props => {
  const [select, setSelect] = useState(props.quantity);

  const options = 100;

  const onSelectChange = e => {
    setSelect(e.target.value);
    props.edit(props.id, e.target.value);
  };

  return (
    <StyledItemDiv className={props.className}>
      <StyledTitle to={'/products/' + props.id}>{props.title}</StyledTitle>
      <StyledImage src={props.image} alt={props.title} />
      <StyledPrice>${props.price}</StyledPrice>
      <StyledSelect options={options} value={select} changed={onSelectChange} />
      <StyledButton onClick={() => props.delete(props.id)}>remove</StyledButton>
    </StyledItemDiv>
  );
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cartContext = useContext(CartContext);

  useEffect(() => {
    setLoading(true);
    let cartFromStorage = JSON.parse(sessionStorage.getItem('cart'));
    // console.log(cartFromStorage);
    if (cartFromStorage === null) {
      cartFromStorage = [];
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

  const editCartItem = (id, quantity) => {
    setLoading(true);
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    console.log({ cart });
    if (cart === undefined) {
      console.log('cart undefined');
      setLoading(false);
      return;
    }
    const prodId = cart.products.find(p => p.prodId === id);
    if (!prodId) {
      console.log('no product found');
      setLoading(false);
      return;
    } else {
      cart.products.map(p => {
        if (p.prodId === id) {
          p.quantity = +quantity;
        }
        return p;
      });
      let subTotal = 0;
      cart.products.forEach(p => {
        subTotal += p.quantity * p.price;
      });
      cart.subTotal = subTotal;
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    cartContext.updateQuantity(cart);
    axios
      .post('/cart', cart)
      .then(res => {
        setCart(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response.data.message);
        console.log(err.response.data.message);
        setLoading(false);
      });
  };

  const deleteHandler = id => {
    setLoading(true);
    //why not cart from storage???
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    if (cart === undefined) {
      console.log('cart undefined');
      setLoading(false);
      return; // return some kind of error
    }
    const existingProdId = cart.products.find(p => p.prodId === id);
    if (!existingProdId) {
      console.log('no existing prod id');
      setLoading(false);
      return; // need another error
    } else {
      const filteredCart = cart.products.filter(p => p.prodId !== id);
      let subTotal = 0;
      filteredCart.forEach(p => {
        subTotal += p.quantity * p.price;
      });
      const newCart = {
        ...cart,
        products: filteredCart,
        subTotal
      };
      if (newCart.products.length < 1) {
        sessionStorage.removeItem('cart');
        setCart([]);
      } else {
        sessionStorage.setItem('cart', JSON.stringify(newCart));
        cartContext.updateQuantity(newCart);
      }
      //why post again? just remove it from state
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
        edit={editCartItem}
        id={ci.prodId}
      />
    ));
  } else if (cart.length === 0) {
    setLoading(false);
    renderedCart = <h1>Cart is empty</h1>;
  }

  let subTotal; // should probably handle prices on back-end (or at least validate them)
  if (renderedCart.length > 0) {
    const filteredPrices = renderedCart.map(obj => obj.props.price);
    const filteredQuants = renderedCart.map(obj => obj.props.quantity);
    const oneArray = filteredPrices.map((x, index) => x * filteredQuants[index]);
    subTotal = oneArray.reduce((a, b) => a + b).toFixed(2);
  }

  return (
    <StyledCartDiv>
      {error !== '' ? (
        <StyledH2>{error}</StyledH2>
      ) : (
        <StyledH2>Your Shopping Cart</StyledH2>
      )}
      {renderedCart}
      {subTotal && (
        <StyledOrderSummary
          subTotal={subTotal}
          shippingPrice={subTotal > 35 ? 'FREE' : 'TBD'}
        />
      )}
      {renderedCart.length > 0 && (
        <StyledLink to='/checkout'>Proceed to Checkout</StyledLink>
      )}
    </StyledCartDiv>
  );
};

export default Cart;

const StyledCartDiv = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto;
  ${'' /* grid-template-areas:  'title . .'
                        'cartItems cartItems totals'
                        'cartItems cartItems totals'
                        'cartItems cartItems totals'
                        'cartItems cartItems totals'; */}
  margin: 1rem 6rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin: 1rem 0;
  }
`;

const StyledOrderSummary = styled(OrderSummary)`
  grid-column: 2/3;
  grid-row: 2/3;
  align-self: center;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: auto;
    margin: 0;
    margin-top: -2rem;
  }
`;

const StyledH2 = styled.h2`
  margin: 0.5rem 0;
  ${'' /* grid-area: title; */}
`;

const StyledItemDiv = styled.div`
  grid-column: 1/2;
  ${'' /* grid-area: cartItems; */}
  display: grid;
  grid-template-columns: 3fr 4fr 1fr 2fr;
  grid-template-rows: repeat(3, 1fr);
  ${'' /* grid-template-areas:  'img . . .'
                        'img title quant price'
                        'img . . bttn'; */}
  align-content: start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #888383;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const StyledTitle = styled(Link)`
  ${'' /* grid-area: title; */}
  grid-column: 2/3;
  grid-row: 2/3;
  margin-right: 1rem;
  font-size: 1.2rem;
  margin: 0;
  justify-self: start;
  align-self: start;
  ${'' /* padding-top: 0.6rem; */}
  text-transform: uppercase;
  color: #3f6cd7;
  text-decoration: none;
  font-weight: bold;

  @media (max-width: 768px) {
    grid-column: 2/4;
    grid-row: 1/2;
  }
`;

const StyledImage = styled.img`
  grid-column: 1/2;
  grid-row: 1/4;
  ${'' /* grid-area: img; */}
  padding: 5px;
  width: 100%;
  ${'' /* min-width: 300px; */}

  @media (max-width: 768px) {
    min-width: 200px;
  }
`;

const StyledPrice = styled.h2`
  grid-column: 4/5;
  grid-row: 2/3;
  ${'' /* grid-area: price; */}
  margin-right: 1rem;
  font-size: 1.2rem;
  margin: 0;
  align-self: start;
  justify-self: end;

  @media (max-width: 768px) {
    grid-column: 2/3;
    justify-self: start;
  }
`;

const StyledSelect = styled(Select)`
  grid-column: 3/4;
  grid-row: 2/3;
  justify-self: start;
  align-self: start;

  @media (max-width: 768px) {
    grid-column: 2/3;
    grid-row: 3/4;
  }
`;

const StyledButton = styled.button`
  grid-column: 4/5;
  grid-row: 3/4;
  place-self: end;
  ${'' /* grid-area: bttn; */}
  border: none;
  color: #000;
  font: inherit;
  background: white;
  width: min-content;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    grid-column: 3/4;
    align-self: start;
  }
`;

const StyledLink = styled(Link)`
  ${'' /* grid-area: totals; */}
  grid-column: 2/3;
  grid-row: 3/4;
  padding: 1.5rem;
  margin-left: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
  font-family: inherit;
  background: #000;
  color: white;
  text-decoration: none;
  text-align: center;
  width: 100%;
  height: max-content;
  ${'' /* margin-right: 20px; */}

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: auto;
    margin: 0;
  }
`;

// const StyledQuant = styled.h3`
//   grid-column: 3/4;
//   grid-row: 2/3;
//   ${'' /* grid-area: quant; */}
//   margin-right: 1rem;
//   font-size: 1.2rem;
//   margin: 0;
//   justify-self: start;
//   align-self: start;
//   ${'' /* padding-top: 0.6rem; */}

//   @media (max-width: 768px) {
//     grid-column: 2/3;
//     grid-row: 3/4;
//   }
// `;
