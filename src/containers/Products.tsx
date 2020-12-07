import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Product from '../components/Product';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import Paginator from '../components/Paginator';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [compState, setCompState] = useState<'Loading' | 'Rendered' | 'Error'>(
    'Rendered'
  );

  const history = useHistory();

  const urlPageValue = new URLSearchParams(useLocation().search).get('page');

  useEffect(() => {
    let effectGetURL: string;
    if (urlPageValue !== null && typeof +urlPageValue === 'number') {
      effectGetURL = `/products?page=${urlPageValue}`;
      setPage(+urlPageValue); // the cause of the problem
    } else {
      effectGetURL = '/products';
    }
    setCompState('Loading');
    axios
      .get(effectGetURL)
      .then(res => {
        const fetchedProducts = [];
        for (let key in res.data.products) {
          fetchedProducts.push({
            ...res.data.products[key],
            id: key
          });
        }
        setProducts(fetchedProducts);
        setTotalItems(res.data.totalItems);
        setCompState('Rendered');
      })
      .catch(err => {
        setCompState('Error');
      });
  }, [urlPageValue]);

  const loadPosts = (direction: 'next' | 'previous') => {
    setCompState('Loading');
    let localPage: number;
    if (direction === 'next') {
      setPage(prevState => {
        return prevState + 1;
      });
      localPage = page + 1;
    } else {
      setPage(prevState => {
        return prevState - 1;
      });
      localPage = page - 1;
    }
    axios
      .get(`/products?page=${localPage}`)
      .then(res => {
        const fetchedProducts = [];
        for (let key in res.data.products) {
          fetchedProducts.push({
            ...res.data.products[key],
            id: key
          });
        }
        setProducts(fetchedProducts);
        setTotalItems(res.data.totalItems);
        setCompState('Rendered');
        history.push(`/products?page=${localPage}`);
      })
      .catch(err => {
        setCompState('Error');
        console.error(err.response.data);
      });
  };

  const clickDeleteHandler = (id: string) => {
    console.log(id);
    const deletedProduct = { id: id };
    setCompState('Loading');
    axios
      .post('/delete-product/', deletedProduct, {
        headers: { Authorization: 'bearer ' + localStorage.getItem('token') }
      })
      .then(res => {
        console.log('Delete res.data', res.data);
        setCompState('Rendered');
      })
      .then(() => {
        history.push('/products');
      })
      .catch(err => {
        setCompState('Error');
      });
  };

  let renderedProducts: JSX.Element | JSX.Element[] = <Spinner />;
  if (compState === 'Rendered') {
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
    <StyledMain>
      {compState === 'Error' ? (
        <Modal show={compState === 'Error'}>
          Error <br />
          Cannot find products. Please try again in a moment.
        </Modal>
      ) : (
        <>
          {renderedProducts}
          <StyledPaginator
            next={() => loadPosts('next')}
            previous={() => loadPosts('previous')}
            page={page}
            finalPage={Math.ceil(totalItems / 10)}
          />
        </>
      )}
    </StyledMain>
  );
};

export default Products;

const StyledMain = styled.main`
  ${'' /* margin: 56px; */}
  ${'' /* margin-left: 25px; */}
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2fr minmax(0, 1fr);
  grid-gap: 20px;

  @media (max-width: 768px) {
    margin: 0;
  }
`;

const StyledPaginator = styled(Paginator)`
  grid-column: 2/3;
`;
