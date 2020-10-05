import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/Button/Button';
import { addToCart } from '../../utils/addToCart';

const ProductPage = props => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  let { id } = useParams();
  const history = useHistory();

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
    addToCart(id, product.price);
    history.push('/cart');
  };

  // It calls this twice everytime
  // console.log(product);

  let prod;
  if (loading) {
    prod = <Spinner />;
  } else if (!loading) {
    prod = (
      <>
        <StyledTitle>{product.title}</StyledTitle>
        <StyledPrice>${product.price}</StyledPrice>
        <StyledImage src={product.image} alt={product.title} />
        <StyledDesc>{product.description}</StyledDesc>
        <StyledButton clicked={addToCartHandler}>Add to Cart</StyledButton>
      </>
    );
  }

  return <StyledDiv>{prod}</StyledDiv>;
};

export default ProductPage;

const StyledDiv = styled.div`
  margin-top: 2rem;
  margin-left: 2rem;
  width: 80%;
  display: grid;
  grid-template-areas: 'img title' 'img price' 'img desc' 'img bttn';
`;

const StyledTitle = styled.h1`
  grid-area: title;
`;

const StyledImage = styled.img`
  grid-area: img;
  width: 25rem;
`;

const StyledPrice = styled.h2`
  grid-area: price;
`;

const StyledDesc = styled.p`
  grid-area: desc;
`;

const StyledButton = styled(Button)`
  grid-area: bttn;
`;
