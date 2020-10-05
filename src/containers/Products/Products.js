import React, { useState, useEffect } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Spinner from '../../components/Spinner/Spinner';
import Button from '../../components/Button/Button';
import { addToCart } from '../../utils/addToCart';

const Product = props => {
  const location = useLocation(); //might not be the best place for this
  const history = useHistory();

  const clickDeleteHandler = () => {
    console.log(props.id);
    const deletedProduct = { id: props.id };
    axios
      .post('/delete-product/', deletedProduct, {
        headers: { Authorization: 'bearer ' + localStorage.getItem('token') }
      })
      .then(res => {
        console.log('Delete res', res);
        console.log('Delete res.data', res.data);
      })
      .then(() => {
        history.push('/products');
      })
      .catch(err => console.log(err));
  };

  const addToCartHandler = () => {
    addToCart(props.id, props.price);
    history.push('/cart');
  };

  let buttons = undefined;
  if (location.pathname === '/products') {
    buttons = <Button clicked={addToCartHandler}>Add To Cart</Button>;
  } else if (location.pathname === '/admin/products') {
    buttons = (
      <div>
        <StyledLink to={{ pathname: '/admin/edit-product', search: '?id=' + props.id }}>
          Edit
        </StyledLink>
        {/* <Button clicked={clickEditHandler}>Edit</Button> */}
        <Button clicked={clickDeleteHandler}>Delete</Button>
      </div>
    );
  }

  return (
    <StyledProductDiv>
      <StyledAnchor href={'/products/' + props.id}>{props.title}</StyledAnchor>
      <StyledImg src={props.img} alt={props.title} />
      <StyledPrice>$ {props.price}</StyledPrice>
      {buttons}
    </StyledProductDiv>
  );
};

const Products = props => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/products')
      .then(res => {
        const fetchedProducts = [];
        for (let key in res.data) {
          fetchedProducts.push({
            ...res.data[key],
            id: key
          });
        }
        setProducts(fetchedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  let renderedProducts = <Spinner />;
  if (!loading) {
    renderedProducts = products.map(p => (
      <Product key={p._id} title={p.title} img={p.image} price={p.price} id={p._id} />
    ));
  }
  // console.log(renderedProducts);

  return <StyledProductsDiv>{renderedProducts}</StyledProductsDiv>;
};

export default Products;

const StyledLink = styled(Link)`
  padding: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  background-color: white;
  border: 3px solid #38689e;
  color: #38689e;
  margin-right: 20px;
  text-decoration: none;

  &:hover {
    background-color: #38689e;
    color: white;
    cursor: pointer;
  }
`;

const StyledProductsDiv = styled.div`
  ${'' /* margin: 56px; */}
  margin-left: 25px;
  display: grid;
  grid-template-columns: repeat(auto-fit, 250px);
`;

const StyledProductDiv = styled.div`
  ${'' /* background-color: #f4f4f4; */}
  width: 250px;
  padding: 15px;
  ${'' /* border: 4px solid #bebebe; */}
`;

const StyledAnchor = styled.a`
  font-size: 1em;
  margin: 0.5rem;
`;

const StyledImg = styled.img`
  height: 200px;
`;

const StyledPrice = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5rem;
`;

// old add-to-cart
// const product = { id: props.id, userId: localStorage.getItem('userId') };
// axios
//   .post('/cart', product)
//   .then((res) => {
//     console.log('Cart res', res);
//     console.log('Cart res.data', res.data);
//   })
//   .then(() => {
//     history.push('/');
//   })
//   .catch((err) => {
//     console.error(err);
//   });
