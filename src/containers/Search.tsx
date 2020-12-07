import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Product from '../components/Product';
import Spinner from '../components/Spinner';
import Modal from '../components/Modal';

const Search: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [compState, setCompState] = useState<'Loading' | 'Rendered' | 'Error'>(
    'Rendered'
  );

  const value = new URLSearchParams(useLocation().search).get('value');

  useEffect(() => {
    setCompState('Loading');
    axios
      .get(`/search?value=${value}`)
      .then(res => {
        console.log(res.data);
        setResults(res.data);
        setCompState('Rendered');
      })
      .catch(err => {
        setCompState('Error');
        console.error(err);
      });
  }, [value]);

  let renderedResults;
  if (compState === 'Loading') {
    renderedResults = <Spinner />;
  } else if (compState === 'Rendered' && results !== undefined) {
    renderedResults = results.map(r => (
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

  return (
    <StyledMain>
      {compState === 'Error' && (
        <Modal show={compState === 'Error'}>Search Failed. Please try again.</Modal>
      )}
      {results.length !== 1 ? (
        <StyledH1>{results.length} Results Found</StyledH1>
      ) : (
        <StyledH1>{results.length} Result Found</StyledH1>
      )}
      {renderedResults}
    </StyledMain>
  );
};

export default Search;

const StyledMain = styled.main`
  ${'' /* margin: 56px; */}
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
