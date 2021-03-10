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
        <Heading>{product.title}</Heading>
        <Price>${product.price}</Price>
        <Image src={product.image} alt={product.title} />
        <AboutHeading>ABOUT</AboutHeading>
        <Description>{product.description}</Description>
        <ExtendedSelect name='quantity' options={options} changed={selectChangeHandler} />
        <ExtendedButton clicked={addToCartHandler}>Add to Cart</ExtendedButton>
      </>
    );
  }

  return (
    <Main>
      {compState === 'Error' ? (
        <Modal show={compState === 'Error'}>
          <h1>Error</h1>
          Cannot find product, please try again.
        </Modal>
      ) : (
        <>{prod}</>
      )}
    </Main>
  );
};

export default ProductPage;

const Main = styled.main`
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

const Heading = styled.h1`
  grid-area: title;
  text-transform: uppercase;
`;

const Image = styled.img`
  grid-area: img;
  width: 25rem;
  place-self: center;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const Price = styled.p`
  grid-area: price;
  font-size: 22px;
  font-weight: 500;
`;

const AboutHeading = styled.h2`
  grid-area: about;
  font-size: 18px;
  font-weight: 600;
`;

const Description = styled.p`
  grid-area: desc;
`;

const ExtendedSelect = styled(Select)`
  grid-area: bttn;
  justify-self: start;
`;

const ExtendedButton = styled(Button)`
  grid-area: bttn;
  justify-self: center;
  padding: 0 2rem;
`;
