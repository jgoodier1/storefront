import React from 'react';
import NavItem from './NavItem/NavItem';
import styled from 'styled-components';

const NavItems = () => {
  return (
    <StyledUl>
      <NavItem link='/' exact>
        Home
      </NavItem>
      <NavItem link='/products'>Products</NavItem>
      <NavItem link='/signin'>Sign In</NavItem>
      <NavItem link='/cart'>Cart</NavItem>
      <NavItem link='/admin/add-product'>Add Product</NavItem>
      <NavItem link='/admin/products'>Admin Products</NavItem>
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
