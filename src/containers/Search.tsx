import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Product from '../components/Product';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import useFetch from '../hooks/useFetch';

interface ProductInterface {
  prod_id: string;
  title: string;
  image: string;
  price: number;
  description: string;
}

const Search: React.FC = () => {
  const value = new URLSearchParams(useLocation().search).get('value');

  const [results, compState] = useFetch<ProductInterface[]>(
    'GET',
    `/search?value=${value}`
  );

  let renderedResults;
  if (compState === 'Loading') {
    renderedResults = <Spinner />;
  } else if (compState === 'Rendered' && results) {
    renderedResults = results.map((r: ProductInterface) => (
      <Product
        key={r.prod_id}
        title={r.title}
        image={r.image}
        price={r.price}
        description={r.description}
        id={r.prod_id}
      />
    ));
  }

  return (
    <Container>
      {compState === 'Error' ? (
        <Modal show={compState === 'Error'}>
          <h1>Error</h1>
          Search Failed. Please try again.
        </Modal>
      ) : (
        <>
          {results !== undefined ? (
            results.length !== 1 ? (
              <>
                <Heading>{results.length} Results Found</Heading>
                {renderedResults}
              </>
            ) : (
              <>
                <Heading>{results.length} Result Found</Heading>
                {renderedResults}
              </>
            )
          ) : (
            <>{renderedResults}</>
          )}
        </>
      )}
    </Container>
  );
};

export default Search;

const Container = styled.main`
  margin-left: 25px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2fr minmax(0, 1fr);
  grid-gap: 20px;

  @media (max-width: 768px) {
    margin: 0;
  }
`;

const Heading = styled.h1`
  justify-self: end;

  @media (max-width: 768px) {
    grid-column: 2 /3;
    justify-self: center;
  }
`;
