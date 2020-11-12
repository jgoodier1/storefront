import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [results, setResults] = useState();

  const value = new URLSearchParams(useLocation().search).get('value');

  useEffect(() => {
    axios.get(`/search?value=${value}`).then(res => {
      setResults(res.data);
    });
  }, [value]);

  let renderedResults;
  if (results !== undefined) {
    renderedResults = results.map((r, i) => (
      <React.Fragment key={i}>
        <h1>{r.title}</h1>
        <h1>{r.price}</h1>
      </React.Fragment>
    ));
  }

  return (
    <div>
      <h1>Search Results</h1>
      {renderedResults}
    </div>
  );
};

export default Search;
