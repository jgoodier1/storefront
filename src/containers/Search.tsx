import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Product from '../components/Product';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';
import useFetch from '../hooks/useFetch';

interface Result {
  _id: string;
  title: string;
  image: string;
  price: number;
  description: string;
}

const Search: React.FC = () => {
  const value = new URLSearchParams(useLocation().search).get('value');

  const [results, compState] = useFetch('GET', `/search?value=${value}`);

  let renderedResults;
  if (compState === 'Loading') {
    renderedResults = <Spinner />;
  } else if (compState === 'Rendered' && results) {
    renderedResults = results.data.map((r: Result) => (
      <Product
        key={r._id}
        title={r.title}
        image={r.image}
        price={r.price}
        description={r.description}
        id={r._id}
      />
    ));
  }

  // this is super messy 🙃
  return (
    <StyledMain>
      {compState === 'Error' ? (
        <Modal show={compState === 'Error'}>
          <h1>Error</h1>
          Search Failed. Please try again.
        </Modal>
      ) : (
        <>
          {results !== null ? (
            results.data.length !== 1 ? (
              <>
                <StyledH1>{results.data.length} Results Found</StyledH1>
                {renderedResults}
              </>
            ) : (
              <>
                <StyledH1>{results.data.length} Result Found</StyledH1>
                {renderedResults}
              </>
            )
          ) : (
            <>{renderedResults}</>
          )}
        </>
      )}
    </StyledMain>
  );
};

export default Search;

const StyledMain = styled.main`
  margin-left: 25px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 2fr minmax(0, 1fr);
  grid-gap: 20px;

  @media (max-width: 768px) {
    margin: 0;
  }
`;

const StyledH1 = styled.h1`
  justify-self: end;

  @media (max-width: 768px) {
    grid-column: 2 /3;
    justify-self: center;
  }
`;
