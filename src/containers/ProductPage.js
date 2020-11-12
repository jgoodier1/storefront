import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { addToCart } from '../utils/addToCart';
import Select from '../components/Select';
import CartContext from '../context/cartContext';

const ProductPage = props => {
  const [product, setProduct] = useState({});
  const [select, setSelect] = useState(1);
  const [loading, setLoading] = useState(false);
  let { id } = useParams();
  const history = useHistory();
  const cartContext = useContext(CartContext);
  console.log(cartContext);

  const options = 100;
  console.log({ options });

  useEffect(() => {
    setLoading(true);
    axios
      .get('/products/' + id)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  const addToCartHandler = () => {
    addToCart(id, product.price, select, cartContext.updateQuantity);
    // cartContext.updateQuantity();
    history.push('/cart');
  };

  // It calls this twice everytime
  // console.log(product);

  const selectChangeHandler = e => {
    setSelect(e.target.value);
  };

  let prod;
  if (loading) {
    prod = <Spinner />;
  } else if (!loading) {
    prod = (
      <>
        <StyledTitle>{product.title}</StyledTitle>
        <StyledPrice>${product.price}</StyledPrice>
        <StyledImage src={product.image} alt={product.title} />
        <StyledH3>ABOUT</StyledH3>
        <StyledDesc>{product.description}</StyledDesc>
        <StyledSelect options={options} changed={selectChangeHandler} />
        <StyledButton clicked={addToCartHandler}>Add to Cart</StyledButton>
      </>
    );
  }

  return <StyledDiv>{prod}</StyledDiv>;
};

export default ProductPage;

const StyledDiv = styled.div`
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
