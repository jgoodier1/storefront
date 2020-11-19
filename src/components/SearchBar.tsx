import React from 'react';
import styled from 'styled-components';

import search from '../images/search.png';

interface SearchBarProps {
  search: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  changed: (e: React.FormEvent<HTMLInputElement>) => void;
  className?: string;
}

const SearchBar = (props: SearchBarProps) => {
  // console.log(searchValue);
  return (
    <form className={props.className} onSubmit={e => props.search(e)}>
      <StlyedInput
        type='search'
        placeholder='Search...'
        value={props.value}
        onChange={props.changed}
      />
      <StyledBttn type='submit'>
        <StyledImg src={search} alt='search' />
      </StyledBttn>
    </form>
  );
};

export default SearchBar;

const StlyedInput = styled.input`
  height: 3rem;
  width: auto;
  border: 1px solid black;
  font-size: 20px;
  color: #a8a8a8;
  padding-left: 1rem;

  :focus {
    outline: none;
    color: #000;
  }
`;

const StyledImg = styled.img`
  height: 25px;
  background: #fff;
`;
const StyledBttn = styled.button`
  height: 3rem;
  background: #fff;
  border: 1px solid black;
  border-left: none;
  position: relative;
  top: 3px;

  @media (max-width: 768px) {
    top: 4px;
  }
`;
