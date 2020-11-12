import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { addToCart } from '../utils/addToCart';
import Modal from '../components/Modal';
import CartContext from '../context/cartContext';

const Product = props => {
  const cartContext = useContext(CartContext);
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
      <StyledAnchor href={'/products/' + props.id}>
        {props.title.toUpperCase()}
      </StyledAnchor>
      <StyledDesc>{shortenedDesc}</StyledDesc>
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
        description={p.description}
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

const StyledProductsDiv = styled.div`
  ${'' /* margin: 56px; */}
  margin-left: 25px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2fr minmax(0, 1fr);
  grid-gap: 20px;

  @media (max-width: 768px) {
    margin: 0;
  }
`;

const StyledProductDiv = styled.div`
  ${'' /* background-color: #f4f4f4;
  width: 250px;
  padding: 15px;
  border: 4px solid #bebebe; */}
  padding: 2.5rem 0;
  border-bottom: 1px solid #888383;
  display: grid;
  ${'' /* grid-template-columns: 20rem 1fr;
  grid-template-rows: repeat(4, 1fr); */}
  grid-column: 2/3;
  grid-template-areas:
    'img img title'
    'img img desc'
    'img img desc'
    'img img price'
    'img img bttn';
`;

const StyledAnchor = styled.a`
  font-size: 1em;
  margin: 0.5rem 0;
  ${'' /* grid-column: 2/3; */}
  grid-area: title;
  text-decoration: none;
  color: #000;
  font-weight: bold;
  font-size: 20px;
`;

const StyledImg = styled.img`
  ${'' /* height: 200px; */}
  width: 100%;
  min-width: 10rem;
  ${'' /* grid-column: 1/2; */}
  ${'' /* grid-row: 1/5; */}
  grid-area: img;
  margin-right: 1rem;
`;

const StyledDesc = styled.p`
  ${'' /* grid-column: 2/3; */}
  grid-area: desc;
  font-style: italic;
  color: #4f4f4f;
`;

const StyledPrice = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.5rem;
  ${'' /* grid-column: 2/3; */}
  grid-area: price;
`;

const StyledButton = styled.button`
  ${'' /* grid-column: 2/3; */}
  grid-area: bttn;
  position: relative;
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
