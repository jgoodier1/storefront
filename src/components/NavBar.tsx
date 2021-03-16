import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
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
    <ListItem className={props.className}>
      <ExtendedNavLink to={props.link} exact={props.exact}>
        {props.children}
      </ExtendedNavLink>
    </ListItem>
  );
};

const NavItems: React.FC<NavItemsProps> = props => {
  const dispatch = useDispatch();
  const history = useHistory();
  const cartContext = useContext(CartContext);
  const isLoggedIn = useSelector(selectAuthState);

  return (
    <UnorderList>
      <LogoLink link='/' exact>
        <LogoImage src={logo} alt='store logo' />
      </LogoLink>
      {/* TODO: this messed with the searchbar responsiveness */}
      <SearchBarListItem>
        <SearchBar search={props.search} />
      </SearchBarListItem>
      <Products link='/products'>Products</Products>
      <Orders link='/orders'>Orders</Orders>
      {!isLoggedIn && (
        <>
          <AuthListItem>
            <AuthButton onClick={() => dispatch(showModal())}>Sign In</AuthButton>
          </AuthListItem>
        </>
      )}
      {isLoggedIn && (
        <>
          <AuthListItem>
            <AuthButton onClick={() => dispatch(logout({ history }))}>Logout</AuthButton>
          </AuthListItem>
        </>
      )}
      <CartLink link='/cart'>
        <div>
          <CartImage src={shoppingCart} alt='cart' />
          <Span>{cartContext.quantity}</Span>
        </div>
      </CartLink>
    </UnorderList>
  );
};

const NavBar: React.FC<NavBarProps> = props => {
  return (
    <Header>
      <nav style={{ width: '100%' }} role='navigation'>
        <NavItems search={props.search} />
      </nav>
    </Header>
  );
};

export default NavBar;

const Header = styled.header`
  height: 70px;
  width: 100%;
  display: flex;
  border-bottom: 1px solid black;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    height: auto;
  }
`;

const UnorderList = styled.ul`
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

const ListItem = styled.li`
  margin: 0;
  display: flex;
  ${'' /* height: 100%; */}
  width: auto;
  align-items: center;
  place-self: center;
`;

const AuthButton = styled.button`
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

const ExtendedNavLink = styled(NavLink)`
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

const LogoImage = styled.img`
  height: 56px;
`;

const CartImage = styled.img`
  height: 2rem;
`;

const Span = styled.span`
  background: #80f9ff;
  border-radius: 40px;
  width: 25px;
  height: 25px;
  text-align: center;
  display: inline-block;
  position: relative;
  top: -23px;
  right: 12px;
`;

const SearchBarListItem = styled(ListItem)`
  grid-area: searchbar;
  place-self: center;
`;

const LogoLink = styled(NavItem)`
  grid-area: logo;
`;

const Products = styled(NavItem)`
  grid-area: products;
`;

const Orders = styled(NavItem)`
  grid-area: orders;
`;

const AuthListItem = styled(ListItem)`
  grid-area: auth;
`;

const CartLink = styled(NavItem)`
  grid-area: cart;
`;

//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
