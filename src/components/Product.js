import React, { useContext } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../components/Button';
import { addToCart } from '../utils/addToCart';
import CartContext from '../context/cartContext';

const Product = props => {
  const cartContext = useContext(CartContext);
  const location = useLocation(); //might not be the best place for this
  const history = useHistory();

  const addToCartHandler = () => {
    addToCart(props.id, props.price, 1, cartContext.updateQuantity);
    history.push('/cart');
  };

  let buttons = undefined;
  if (location.pathname === '/products') {
    buttons = <Button clicked={addToCartHandler}>ADD TO CART</Button>;
  } else if (location.pathname === '/admin/products') {
    buttons = (
      <div>
        <StyledLink to={{ pathname: '/admin/edit-product', search: '?id=' + props.id }}>
          Edit
        </StyledLink>
        {/* <Button clicked={clickEditHandler}>Edit</Button> */}
        <Button clicked={() => props.delete(props.id)}>Delete</Button>
      </div>
    );
  }

  let shortenedDesc;
  if (props.description.length > 100) {
    shortenedDesc = props.description.slice(0, 100).concat('...');
  }

  return (
    <StyledProductDiv>
      <StyledImg src={props.img} alt={props.title} />
      <StyledAnchor to={'/products/' + props.id}>
        {props.title.toUpperCase()}
      </StyledAnchor>
      <StyledDesc>{shortenedDesc}</StyledDesc>
      <StyledPrice>$ {props.price}</StyledPrice>
      {buttons}
    </StyledProductDiv>
  );
};

export default Product;

const StyledLink = styled(Link)`
  padding: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  background-color: white;
  border: 2px solid #000;
  color: #000;
  text-decoration: none;
  margin-right: 20px;

  &:hover {
    background-color: #000;
    color: white;
    cursor: pointer;
  }
`;

const StyledProductDiv = styled.div`
  padding: 2.5rem 0;
  border-bottom: 1px solid #888383;
  display: grid;
  grid-column: 2/3;
  grid-template-areas:
    'img img title'
    'img img desc'
    'img img desc'
    'img img price'
    'img img bttn';
`;

const StyledAnchor = styled(Link)`
  font-size: 1em;
  margin: 0.5rem 0;
  grid-area: title;
  text-decoration: none;
  color: #000;
  font-weight: bold;
  font-size: 20px;
`;

const StyledImg = styled.img`
  width: 100%;
  min-width: 10rem;
  grid-area: img;
  margin-right: 1rem;
`;

const StyledDesc = styled.p`
  grid-area: desc;
  font-style: italic;
  color: #4f4f4f;
`;

const StyledPrice = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5rem;
  grid-area: price;
`;
