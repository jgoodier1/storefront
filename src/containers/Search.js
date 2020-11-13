import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

import Product from '../components/Product';

const Search = () => {
  const [results, setResults] = useState([]);

  const value = new URLSearchParams(useLocation().search).get('value');

  useEffect(() => {
    axios.get(`/search?value=${value}`).then(res => {
      setResults(res.data);
    });
  }, [value]);

  let renderedResults;
  if (results !== undefined) {
    renderedResults = results.map(r => (
      <Product
        key={r._id}
        title={r.title}
        img={r.image}
        price={r.price}
        description={r.description}
        id={r._id}
      />
    ));
  }
  console.log(results.length);
  return (
    <StyledDiv>
      {results.length !== 1 ? (
        <StyledH1>{results.length} Results Found</StyledH1>
      ) : (
        <StyledH1>{results.length} Result Found</StyledH1>
      )}
      {renderedResults}
    </StyledDiv>
  );
};

export default Search;

const StyledDiv = styled.div`
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
