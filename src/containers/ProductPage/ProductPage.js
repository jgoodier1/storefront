import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/Button/Button';

const ProductPage = props => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  let { id } = useParams();

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

  // extract this
  const addToCartHandler = () => {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || undefined;
    if (cart === undefined) {
      cart = {};
      const products = [
        {
          prodId: id,
          quantity: 1,
          price: product.price
        }
      ];
      let subTotal = 0;
      products.forEach(p => {
        subTotal += p.quantity * p.price;
      });
      cart.products = products;
      cart.subTotal = subTotal;
    } else {
      const existingProdId = cart.products.find(p => p.prodId === id);
      if (!existingProdId) {
        cart.products.push({ prodId: id, quantity: 1, price: product.price });
      } else {
        cart.products.map(p => p.prodId === id && p.quantity++);
      }
      let subTotal = 0;
      cart.products.forEach(p => {
        subTotal += p.quantity * p.price;
      });
      cart.subTotal = subTotal;
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);
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
