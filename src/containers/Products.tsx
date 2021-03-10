import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Product from '../components/Product';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import Paginator from '../components/Paginator';
import useFetch from '../hooks/useFetch';

interface ProductInterface {
  prod_id: string;
  title: string;
  image: string;
  description: string;
  price: number;
}

interface FetchResponse {
  products: {
    prod_id: string;
    title: string;
    image: string;
    description: string;
    price: number;
  }[];
  totalItems: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [fetchURL, setFetchURL] = useState('/products');

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const urlPageValue = new URLSearchParams(location.search).get('page');
    if (urlPageValue !== null && typeof +urlPageValue === 'number') {
      setFetchURL(`/products?page=${urlPageValue}`);
      setPage(+urlPageValue);
    } else {
      return;
    }
  }, [location]);

  const [data, compState, setCompState] = useFetch<FetchResponse>('GET', fetchURL);

  useEffect(() => {
    if (data !== null && data) {
      setTotalItems(data.totalItems);
      setProducts(data.products);
    }
  }, [data]);

  const loadPosts = (direction: 'next' | 'previous') => {
    if (direction === 'next') {
      setPage(prevState => {
        return prevState + 1;
      });
      setFetchURL(`/products?page=${page + 1}`);
      history.push(`/products?page=${page + 1}`);
    } else {
      setPage(prevState => {
        return prevState - 1;
      });
      setFetchURL(`/products?page=${page - 1}`);
      history.push(`/products?page=${page - 1}`);
    }
  };

  const clickDeleteHandler = (id: string) => {
    const deletedProduct = { id: id };
    setCompState('Loading');
    axios
      .post('/delete-product/', deletedProduct, {
        headers: { Authorization: 'bearer ' + localStorage.getItem('token') }
      })
      .then(res => {
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
  if (compState === 'Rendered' && data !== null) {
    renderedProducts = products.map(p => (
      <Product
        key={p.prod_id}
        title={p.title}
        image={p.image}
        price={p.price}
        description={p.description}
        id={p.prod_id}
        delete={clickDeleteHandler}
      />
    ));
  }

  return (
    <Main>
      {compState === 'Error' ? (
        <Modal show={compState === 'Error'}>
          <h1>Error</h1>
          Cannot find products. Please try again in a moment.
        </Modal>
      ) : (
        <>
          {Array.isArray(renderedProducts) && (
            <Heading>Showing {renderedProducts.length} Products</Heading>
          )}
          {renderedProducts}
          <PositionedPaginator
            next={() => loadPosts('next')}
            previous={() => loadPosts('previous')}
            page={page}
            finalPage={Math.ceil(totalItems / 10)}
          />
        </>
      )}
    </Main>
  );
};

export default Products;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr min(60ch, 100%) 1fr;
  grid-gap: 20px;
`;

const Heading = styled.h1`
  grid-column: 2/3;
  margin-bottom: 0;
  justify-self: center;
`;

const PositionedPaginator = styled(Paginator)`
  grid-column: 2/3;
`;
