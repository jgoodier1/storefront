import React, { useState, useEffect } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { addToCart } from '../utils/addToCart';
import Modal from '../components/Modal';

const Product = props => {
  const location = useLocation(); //might not be the best place for this
  const history = useHistory();

  // const clickDeleteHandler = () => {
  //   console.log(props.id);
  //   const deletedProduct = { id: 123456789022 /*props.id */ };
  //   axios
  //     .post('/delete-product/', deletedProduct, {
  //       headers: { Authorization: 'bearer ' + localStorage.getItem('token') }
  //     })
  //     .then(res => {
  //       console.log('Delete res.data', res.data);
  //     })
  //     .then(() => {
  //       history.push('/products');
  //     })
  //     .catch(err => console.log(err.response.data));
  // };

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
        <Button clicked={() => props.delete(props.id)}>Delete</Button>
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
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const history = useHistory();
  const location = useLocation();

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
        setShowModal(true);
        setError('Cannot find products');
      });
  }, []);

  const clickDeleteHandler = id => {
    console.log(id);
    const deletedProduct = { id: id };
    axios
      .post('/delete-product/', deletedProduct, {
        headers: { Authorization: 'bearer ' + localStorage.getItem('token') }
      })
      .then(res => {
        console.log('Delete res.data', res.data);
      })
      .then(() => {
        history.push('/products');
      })
      .catch(err => {
        setShowModal(true);
        setError(err.response.data);
      });
  };

  const modalClosed = () => {
    setShowModal(false);
    if (location.pathname === '/products') {
      history.push('/');
    }
  };

  let renderedProducts = <Spinner />;
  if (!loading) {
    renderedProducts = products.map(p => (
      <Product
        key={p._id}
        title={p.title}
        img={p.image}
        price={p.price}
        id={p._id}
        delete={clickDeleteHandler}
      />
    ));
  }
  // console.log(renderedProducts);

  return (
    <StyledProductsDiv>
      <Modal show={showModal}>
        <StyledButton onClick={modalClosed}>X</StyledButton>
        Error <br />
        {error}
      </Modal>
      {renderedProducts}
    </StyledProductsDiv>
  );
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

const StyledButton = styled.button`
  position: absolute;
  top: 6px;
  right: 10px;
  border: 0;
  width: 60px;
  height: 60px;
  font-size: 1.75rem;
  font-weight: bold;
  background-color: white;
  cursor: pointer;
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
