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

const SearchBar: React.FC<SearchBarProps> = props => {
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
    <form className={props.className} onSubmit={formik.handleSubmit} role='search'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <Input
        type='search'
        placeholder='Search...'
        id='search'
        name='search'
        value={formik.values.search}
        onChange={formik.handleChange}
      />
      <Button type='submit'>
        <Image src={search} alt='search' />
        {/* Search */}
      </Button>
    </form>
  );
};

export default SearchBar;

const Input = styled.input`
  height: 3rem;
  width: auto;
  border: 1px solid black;
  font-size: 20px;
  color: #585858;
  padding-left: 1rem;

  :focus {
    color: #000;
  }
`;

const Image = styled.img`
  height: 25px;
  background: #fff;
`;

const Button = styled.button`
  height: 3rem;
  background: #fff;
  border: 1px solid black;
  border-left: none;
  position: relative;
  top: 5px;
  line-height: 1;

  @media (max-width: 768px) {
    top: 4px;
  }
`;
