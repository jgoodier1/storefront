import React, { useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { addToCart } from '../utils/addToCart';
import CartContext from '../context/cartContext';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Select from '../components/Select';
import Modal from '../components/Modal';
import useFetch from '../hooks/useFetch';

interface ProductInterface {
  prod_id: string;
  title: string;
  image: string;
  description: string;
  price: number;
}

const ProductPage: React.FC = () => {
  const [select, setSelect] = useState(1);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const cartContext = useContext(CartContext);

  const [product, compState] = useFetch<ProductInterface>('GET', `/products/${id}`);

  const options = 100;

  const addToCartHandler = () => {
    if (product) {
      addToCart(id, product.price, select, cartContext.updateQuantity);
      // cartContext.updateQuantity();
      history.push('/cart');
    } else return;
  };

  const selectChangeHandler = (e: React.FormEvent<HTMLSelectElement>) => {
    setSelect(+e.currentTarget.value);
  };

  let prod;
  if (compState === 'Loading') {
    prod = <Spinner />;
  } else if (compState === 'Rendered' && product) {
    prod = (
      <>
        <StyledTitle>{product.title}</StyledTitle>
        <StyledPrice>${product.price}</StyledPrice>
        <StyledImage src={product.image} alt={product.title} />
        <StyledH3>ABOUT</StyledH3>
        <StyledDesc>{product.description}</StyledDesc>
        <StyledSelect name='quantity' options={options} changed={selectChangeHandler} />
        <StyledButton clicked={addToCartHandler}>Add to Cart</StyledButton>
      </>
    );
  }

  return (
    <StyledMain>
      {compState === 'Error' ? (
        <Modal show={compState === 'Error'}>
          <h1>Error</h1>
          Cannot find product, please try again.
        </Modal>
      ) : (
        <>{prod}</>
      )}
    </StyledMain>
  );
};

export default ProductPage;

const StyledMain = styled.main`
  margin: 2rem 6rem;
  width: auto;
  display: grid;
  grid-template-areas:
    'img title .'
    'img price .'
    'img bttn bttn'
    'img . .'
    'about about about'
    'desc desc desc';

  @media (max-width: 768px) {
    grid-template-areas: 'img' 'title' 'price' 'bttn' 'about' 'desc';
    margin: 2rem;
  }
`;

const StyledTitle = styled.h1`
  grid-area: title;
  text-transform: uppercase;
`;

const StyledImage = styled.img`
  grid-area: img;
  width: 25rem;
  place-self: center;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const StyledPrice = styled.h2`
  grid-area: price;
`;

const StyledH3 = styled.h3`
  grid-area: about;
`;

const StyledDesc = styled.p`
  grid-area: desc;
`;

const StyledSelect = styled(Select)`
  grid-area: bttn;
  justify-self: start;
`;

const StyledButton = styled(Button)`
  grid-area: bttn;
  justify-self: center;
  padding: 0 2rem;
`;
