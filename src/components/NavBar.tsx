import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import SearchBar from './SearchBar';
import CartContext from '../context/cartContext';
import { selectAuthState, logout, showModal } from '../reduxSlices/authSlice';

import logo from '../images/logo2.png';
import shoppingCart from '../images/shopping-cart.png';

interface NavItemProps {
  children: React.ReactNode;
  link: string;
  exact?: boolean;
  className?: string;
}

interface NavItemsProps {
  search: (values: SearchValues) => void;
}

interface NavBarProps {
  search: (values: SearchValues) => void;
}

interface SearchValues {
  search: string;
}

const NavItem: React.FC<NavItemProps> = props => {
  return (
    <SLi className={props.className}>
      <SNavLink to={props.link} exact={props.exact}>
        {props.children}
      </SNavLink>
    </SLi>
  );
};

const NavItems: React.FC<NavItemsProps> = props => {
  const dispatch = useDispatch();
  const cartContext = useContext(CartContext);
  const isLoggedIn = useSelector(selectAuthState);

  return (
    <SUl>
      <PLogo link='/' exact>
        <SLogo src={logo} alt='logo' />
      </PLogo>
      <PSearchBar search={props.search} />
      <PProducts link='/products'>Products</PProducts>
      <POrders link='/orders'>Orders</POrders>
      {!isLoggedIn && (
        <>
          <PAuth>
            <SButton onClick={() => dispatch(showModal())}>Sign In</SButton>
          </PAuth>
          {/* <NavItem link='/signup'>Sign Up</NavItem> */}
        </>
      )}
      {isLoggedIn && (
        <>
          <PAuth>
            <SButton onClick={() => dispatch(logout())}>Logout</SButton>
          </PAuth>
        </>
      )}
      <PCart link='/cart'>
        <div>
          <SCart src={shoppingCart} alt='cart' />
          <SSpan>{cartContext.quantity}</SSpan>
        </div>
      </PCart>
    </SUl>
  );
};

const NavBar: React.FC<NavBarProps> = props => {
  return (
    <SHead>
      <nav style={{ width: '100%' }}>
        <NavItems search={props.search} />
      </nav>
    </SHead>
  );
};

export default NavBar;

const SHead = styled.header`
  height: 70px;
  width: 100%;
  ${'' /* position: fixed; */}
  top: 0;
  left: 0;
  display: flex;
  border-bottom: 1px solid black;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const SUl = styled.ul`
  margin: 0;
  padding: 0;
  list-stlye: none;
  height: 100%;
  display: grid;
  grid-template-areas: 'logo searchbar searchbar products orders auth cart';
  align-items: center;

  @media (max-width: 768px) {
    grid-template-areas:
      'logo logo logo auth cart'
      'searchbar searchbar searchbar searchbar searchbar'
      '. products . orders .';
  }
`;

const SLi = styled.li`
  margin: 0;
  display: flex;
  ${'' /* height: 100%; */}
  width: auto;
  align-items: center;
  place-self: center;
`;

const SButton = styled.button`
  text-decoration: none;
  color: #000;
  background: #fff;
  height: 100%;
  width: auto;
  padding: 1rem 0.6rem;
  font-weight: bold;
  border: 0;
  font-size: 1rem;
  cursor: pointer;
  font-family: inherit;

  &:hover {
    text-decoration: underline;
  }
  &:active,
  &.active {
    color: #000;
  }
`;

const SNavLink = styled(NavLink)`
  text-decoration: none;
  color: #000;
  height: 100%;
  width: auto;
  padding: 1rem 0.3rem;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
  &:active,
  &.active {
    color: #000;
  }
`;

const SLogo = styled.img`
  height: 56px;
`;

const SCart = styled.img`
  height: 2rem;
`;

const SSpan = styled.span`
  ${'' /* position: absolute; */}
  ${'' /* background: #61e7ee; */}
  background: #80f9ff;
  border-radius: 40px;
  ${'' /* width: 20px;
  height: 20px; */}
  width: 25px;
  height: 25px;
  text-align: center;
  display: inline-block;
  position: relative;
  ${'' /* top: -21px;
  right: 22px; */}
  top: -23px;
  right: 12px;
`;

const PSearchBar = styled(SearchBar)`
  grid-area: searchbar;
  place-self: center;
`;

const PLogo = styled(NavItem)`
  grid-area: logo;
`;

const PProducts = styled(NavItem)`
  grid-area: products;
`;

const POrders = styled(NavItem)`
  grid-area: orders;
`;

const PAuth = styled(SLi)`
  grid-area: auth;
`;

const PCart = styled(NavItem)`
  grid-area: cart;
`;

//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
