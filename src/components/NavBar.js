import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NavItem = props => {
  return (
    <StyledLi>
      <StyledNavLink to={props.link} exact={props.exact}>
        {props.children}
      </StyledNavLink>
    </StyledLi>
  );
};

const NavItems = props => {
  return (
    <StyledUl>
      <NavItem link='/' exact>
        Home
      </NavItem>
      <NavItem link='/products'>Products</NavItem>
      {!props.isLoggedIn && (
        <>
          <StyledLi>
            <StyledButton onClick={props.showModal}>Sign In</StyledButton>
          </StyledLi>
          {/* <NavItem link='/signup'>Sign Up</NavItem> */}
          <NavItem link='/cart'>Cart</NavItem>
        </>
      )}
      {props.isLoggedIn && (
        <>
          <NavItem link='/cart'>Cart</NavItem>
          <NavItem link='/orders'>Orders</NavItem>
          <NavItem link='/admin/add-product'>Add Product</NavItem>
          <NavItem link='/admin/products'>Admin Products</NavItem>
          <StyledLi>
            <StyledButton onClick={props.logout}>Logout</StyledButton>
          </StyledLi>
        </>
      )}
    </StyledUl>
  );
};

const NavBar = props => {
  return (
    <StyledHead>
      <nav>
        <NavItems
          isLoggedIn={props.isLoggedIn}
          logout={props.logout}
          showModal={props.showModal}
        />
      </nav>
    </StyledHead>
  );
};

export default NavBar;

const StyledHead = styled.header`
  height: 56px;
  width: 100%;
  ${'' /* position: fixed; */}
  top: 0;
  left: 0;
  display: flex;
  background-color: #f4f4f4;
  justify-content: space-between;
  align-items: center;
`;

const StyledUl = styled.ul`
  margin: 0;
  padding: 0;
  list-stlye: none;
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 100%;
`;

const StyledLi = styled.li`
  margin: 0;
  display: flex;
  height: 100%;
  width: auto;
  align-items: center;
`;

const StyledButton = styled.button`
  text-decoration: none;
  color: #38689e;
  height: 100%;
  width: auto;
  padding: 16px 10px;
  font-weight: bold;
  border: 0;
  font-size: 1rem;
  background: #f4f4f4;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
  &:active,
  &.active {
    color: #2a4e77;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #38689e;
  height: 100%;
  width: auto;
  padding: 16px 10px;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
  &:active,
  &.active {
    color: #2a4e77;
  }
`;
