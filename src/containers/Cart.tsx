import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Spinner from '../components/Spinner';
import Select from '../components/Select';
import CartContext from '../context/cartContext';
import OrderSummary from '../components/OrderSummary';
import Modal from '../components/Modal';
import useFetch from '../hooks/useFetch';

interface CartItemProps {
  quantity: number;
  edit: (id: string, quantity: number) => void;
  delete: (id: string) => void;
  id: string;
  title: string;
  image: string;
  price: number;
  className?: string;
}

interface ICartStorage {
  products: {
    prodId: string;
    price: number;
    quantity: number;
  }[];
  subTotal: number;
}

interface ICart {
  prodId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

const CartItem: React.FC<CartItemProps> = props => {
  const [select, setSelect] = useState(props.quantity);

  const options = 100;

  const onSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelect(+e.currentTarget.value);
    props.edit(props.id, +e.currentTarget.value);
  };

  return (
    <StyledItemDiv className={props.className}>
      <StyledTitle to={'/products/' + props.id}>{props.title}</StyledTitle>
      <StyledImage src={props.image} alt={props.title} />
      <StyledPrice>${props.price}</StyledPrice>
      <StyledSelect
        name='quantity'
        options={options}
        value={select}
        changed={onSelectChange}
      />
      <StyledButton onClick={() => props.delete(props.id)}>remove</StyledButton>
    </StyledItemDiv>
  );
};

const Cart: React.FC = () => {
  const [cart, setCart] = useState<ICart[]>([]);

  const cartContext = useContext(CartContext);

  const cartFromStorage = JSON.parse(sessionStorage.getItem('cart')!);
  const [data, compState, setCompState] = useFetch('POST', '/cart', cartFromStorage);

  useEffect(() => {
    if (data) setCart(data.data);
  }, [data]);

  const editCartItem = (id: string, quantity: number) => {
    setCompState('Loading');
    const cart: ICartStorage = JSON.parse(sessionStorage.getItem('cart')!);
    if (cart === undefined) {
      console.log('cart undefined');
      setCompState('Rendered');
      return;
    }
    const prodId = cart.products.find(p => p.prodId === id);
    if (!prodId) {
      console.log('no product found');
      setCompState('Rendered');
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
        setCompState('Rendered');
      })
      .catch(err => {
        console.error(err.response.data.message);
        setCompState('Error');
      });
  };

  const deleteHandler = (id: string) => {
    setCompState('Loading');
    //why not cart from storage???
    const cart: ICartStorage = JSON.parse(sessionStorage.getItem('cart')!);
    if (cart === undefined) {
      console.log('cart undefined');
      setCompState('Rendered');
      return; // return some kind of error
    }
    const existingProdId = cart.products.find(p => p.prodId === id);
    if (!existingProdId) {
      console.log('no existing prod id');
      setCompState('Rendered');
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
        cartContext.updateQuantity(null);
        return;
      } else {
        sessionStorage.setItem('cart', JSON.stringify(newCart));
        cartContext.updateQuantity(newCart);
        axios
          .post('/cart', newCart)
          .then(res => {
            setCart(res.data);
            setCompState('Rendered');
            console.log(res);
          })
          .catch(err => {
            console.error(err);
            setCompState('Error');
          });
      }
    }
  };

  let renderedCart: JSX.Element | JSX.Element[] = <Spinner />;
  if (cart !== undefined && cart !== null && compState === 'Rendered') {
    renderedCart = cart.map((ci: ICart) => (
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
  } else if (cart === undefined || cart === null || cart.length === 0) {
    // setCompState('Rendered');
    renderedCart = <h1>Cart is empty</h1>;
  }

  let subTotal; // should probably handle prices on back-end (or at least validate them)
  if (cart !== undefined && cart !== null && cart.length > 0) {
    const filteredPrices = cart.map(p => p.price);
    const filteredQuants = cart.map(p => p.quantity);
    const oneArray = filteredPrices.map(
      (x: number, index: number) => x * filteredQuants[index]
    );
    subTotal = +oneArray.reduce((a: number, b: number) => a + b).toFixed(2);
  }

  return (
    <StyledMain>
      {compState === 'Error' && (
        <Modal show={compState === 'Error'}>
          <h1>Error</h1>
          An error occurred. Please try again.
        </Modal>
      )}

      <h1>Your Shopping Cart</h1>
      {renderedCart}
      {subTotal && (
        <StyledOrderSummary
          subTotal={subTotal}
          shippingPrice={subTotal > 35 ? 'FREE' : 'TBD'}
        />
      )}
      {(renderedCart as []).length > 0 && (
        <StyledLink to='/checkout'>Proceed to Checkout</StyledLink>
      )}
    </StyledMain>
  );
};

export default Cart;

const StyledMain = styled.main`
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto;
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

const StyledItemDiv = styled.div`
  grid-column: 1/2;
  display: grid;
  grid-template-columns: 3fr 4fr 1fr 2fr;
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 10px;
  align-content: start;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #888383;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 2fr;
    grid-gap: 0;
  }
`;

const StyledTitle = styled(Link)`
  grid-column: 2/3;
  grid-row: 2/3;
  margin-right: 1rem;
  font-size: 1.2rem;
  margin: 0;
  justify-self: start;
  align-self: start;
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
