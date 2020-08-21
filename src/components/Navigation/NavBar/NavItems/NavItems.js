import React from 'react';
import { useSelector } from 'react-redux';

import NavItem from './NavItem/NavItem';
import styled from 'styled-components';

const NavItems = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  return (
    <StyledUl>
      <NavItem link='/' exact>
        Home
      </NavItem>
      <NavItem link='/products'>Products</NavItem>
      {!isLoggedIn && (
        <>
          <NavItem link='/signin'>Sign In</NavItem>
          <NavItem link='/signup'>Sign Up</NavItem>
          <NavItem link='/cart'>Cart</NavItem>
        </>
      )}
      {isLoggedIn && (
        <>
          <NavItem link='/cart'>Cart</NavItem>
          <NavItem link='/admin/add-product'>Add Product</NavItem>
          <NavItem link='/admin/products'>Admin Products</NavItem>
          <NavItem link='/logout'>Logout</NavItem>
        </>
      )}
    </StyledUl>
  );
};

export default NavItems;

const StyledUl = styled.ul`
  margin: 0;
  padding: 0;
  list-stlye: none;
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 100%;
`;
