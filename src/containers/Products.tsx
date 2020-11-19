import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Product from '../components/Product';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
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

  const clickDeleteHandler = (id: string) => {
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

  let renderedProducts: JSX.Element | JSX.Element[] = <Spinner />;
  if (!loading) {
    renderedProducts = products.map(p => (
      <Product
        key={p._id}
        title={p.title}
        image={p.image}
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
      <Modal show={showModal} modalClosed={modalClosed}>
        <StyledButton onClick={modalClosed}>X</StyledButton>
        Error <br />
        {error}
      </Modal>
      {renderedProducts}
    </StyledProductsDiv>
  );
};

export default Products;

const StyledProductsDiv = styled.div`
  ${'' /* margin: 56px; */}
  ${'' /* margin-left: 25px; */}
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2fr minmax(0, 1fr);
  grid-gap: 20px;

  @media (max-width: 768px) {
    margin: 0;
  }
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
