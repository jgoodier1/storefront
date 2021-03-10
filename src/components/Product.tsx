import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
  const history = useHistory();

  const addToCartHandler = () => {
    addToCart(props.id, props.price, 1, cartContext.updateQuantity);
    history.push('/cart');
  };

  let shortenedDesc;
  if (props.description.length > 100) {
    shortenedDesc = props.description.slice(0, 100).concat('...');
  } else {
    shortenedDesc = props.description;
  }

  return (
    <Container>
      <Image src={props.image} alt='' />
      <Heading2>
        <ExtendedLink to={'/products/' + props.id}>
          {props.title.toUpperCase()}
        </ExtendedLink>
      </Heading2>
      <Description>{shortenedDesc}</Description>
      <Price>$ {props.price}</Price>
      <ExtendedButton clicked={addToCartHandler}>ADD TO CART</ExtendedButton>
    </Container>
  );
};

export default Product;

const Container = styled.div`
  grid-column: 2/3;
  padding: 2.5rem 0;
  border-bottom: 1px solid #888383;
  display: grid;
  grid-template-columns: 350px 1fr;
  grid-gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Heading2 = styled.h2`
  grid-column: 2/3;
  margin: 0;
`;

const ExtendedLink = styled(Link)`
  font-size: 1em;
  text-decoration: none;
  color: #000;
  font-weight: bold;
  font-size: 20px;
`;

const Image = styled.img`
  grid-column: 1/2;
  grid-row: 1/6;
  width: 100%;
  min-width: 10rem;
  max-width: 400px;
  margin-right: 1rem;
`;

const Description = styled.p`
  grid-column: 2/3;
  grid-row: 2/4;
  font-style: italic;
  color: #4f4f4f;
`;

const Price = styled.p`
  grid-column: 2/3;
  grid-row: 4/5;
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5rem;
`;

const ExtendedButton = styled(Button)`
  grid-column: 2/3;
  grid-row: 5/6;
`;
