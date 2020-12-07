import React, { useContext } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';

import Button from './Button';
import { addToCart } from '../utils/addToCart';
import CartContext from '../context/cartContext';

interface ProductProps {
  id: string;
  price: number;
  description: string;
  title: string;
  image: string;
  delete?: (id: string) => void;
}

const Product: React.FC<ProductProps> = props => {
  const cartContext = useContext(CartContext);
  const location = useLocation(); //might not be the best place for this
  const history = useHistory();

  const addToCartHandler = () => {
    addToCart(props.id, props.price, 1, cartContext.updateQuantity);
    history.push('/cart');
  };

  const deleteHandler = () => {
    if (props.delete) props.delete(props.id);
  };

  let buttons = undefined;
  if (location.pathname === '/products') {
    buttons = <StyledBttn clicked={addToCartHandler}>ADD TO CART</StyledBttn>;
  } else if (location.pathname === '/admin/products') {
    // not really using these
    buttons = (
      <div>
        <StyledLink to={{ pathname: '/admin/edit-product', search: '?id=' + props.id }}>
          Edit
        </StyledLink>
        {/* <Button clicked={clickEditHandler}>Edit</Button> */}
        <Button clicked={deleteHandler}>Delete</Button>
      </div>
    );
  }

  let shortenedDesc;
  if (props.description.length > 100) {
    shortenedDesc = props.description.slice(0, 100).concat('...');
  } else {
    shortenedDesc = props.description;
  }

  return (
    <StyledProductDiv>
      <StyledImg src={props.image} alt={props.title} />
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

// not really using this
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
  grid-column: 2/3;
  padding: 2.5rem 0;
  border-bottom: 1px solid #888383;
  display: grid;
  grid-template-columns: 400px 1fr;
  grid-gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledAnchor = styled(Link)`
  grid-column: 2/3;
  font-size: 1em;
  margin: 0.5rem 0;
  text-decoration: none;
  color: #000;
  font-weight: bold;
  font-size: 20px;
`;

const StyledImg = styled.img`
  grid-column: 1/2;
  grid-row: 1/6;
  width: 100%;
  min-width: 10rem;
  max-width: 400px;
  margin-right: 1rem;
`;

const StyledDesc = styled.p`
  grid-column: 2/3;
  grid-row: 2/4;
  font-style: italic;
  color: #4f4f4f;
`;

const StyledPrice = styled.p`
  grid-column: 2/3;
  grid-row: 4/5;
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5rem;
`;

const StyledBttn = styled(Button)`
  grid-column: 2/3;
  grid-row: 5/6;
`;
