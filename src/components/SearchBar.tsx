import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import styled from 'styled-components';

import search from '../images/search.png';

interface SearchBarProps {
  search: (values: MySearchFormValues) => void;
  className?: string;
}

interface MySearchFormValues {
  search: string;
}

const SearchBar = (props: SearchBarProps) => {
  const validationSchema = yup.object().shape({
    search: yup.string().required().min(1)
  });

  const formik = useFormik({
    initialValues: {
      search: ''
    },
    validationSchema,
    onSubmit(values: MySearchFormValues) {
      props.search(values);
    }
  });

  return (
    <form className={props.className} onSubmit={formik.handleSubmit}>
      <StlyedInput
        type='search'
        placeholder='Search...'
        id='search'
        name='search'
        value={formik.values.search}
        onChange={formik.handleChange}
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
