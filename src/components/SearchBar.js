import React from 'react';
import styled from 'styled-components';

import search from '../images/search.png'

const SearchBar = (props) => {
  return (
    <div className={props.className}>
      <StlyedInput type='search' placeholder='Search...' />
      <StyledBttn type='submit'>
        <StyledImg src={search} alt='search'/>
      </StyledBttn>
    </div>
  );
};

export default SearchBar;

const StlyedInput = styled.input`
  height: 3rem;
  width: 24rem;
  border: 1px solid black;
  font-size: 20px;
  color: #a8a8a8;
  padding-left: 1rem;

  :focus {
    outline:none;
    color: #000;
  }
`

const StyledImg = styled.img`
  height: 25px;
  background: #fff;
`
const StyledBttn = styled.button`
  height: 3rem;
  background: #fff;
  border: 1px solid black;
  border-left: none;
  position: absolute;
`