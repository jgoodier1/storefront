import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import SearchBar from './SearchBar';
import logo from '../images/logo2.png';
import shoppingCart from '../images/shopping-cart.png'
import menu from '../images/menu.png';

const NavItem = props => {
  return (
    <StyledLi className={props.className}>
      <StyledNavLink to={props.link} exact={props.exact}>
        {props.children}
      </StyledNavLink>
    </StyledLi>
  );
};

const NavItems = props => {
  let responsiveNavItems;
  if (props.width > 725) {
    responsiveNavItems = (
      <StyledUl>
      <NavItem link='/' exact>
        <StyledLogo src={logo} alt='logo' />
      </NavItem>
      <PositionedSearchBar />
      <PositionedProducts link='/products'>Products</PositionedProducts>
      {!props.isLoggedIn && (
        <>
          <PosSignInLogOut>
            <StyledButton onClick={props.showModal}>Sign In</StyledButton>
          </PosSignInLogOut>
          {/* <NavItem link='/signup'>Sign Up</NavItem> */}
        </>
      )}
      {props.isLoggedIn && (
        <>
          {/* <NavItem link='/cart'>Cart</NavItem> */}
          <NavItem link='/orders'>Orders</NavItem>
          {/* <NavItem link='/admin/add-product'>Add Product</NavItem>
          <NavItem link='/admin/products'>Admin Products</NavItem> */}
          <PosSignInLogOut>
            <StyledButton onClick={props.logout}>Logout</StyledButton>
          </PosSignInLogOut>
        </>
      )}
      <PositionedCart link='/cart'>
        <div>
          <StyledCart src={shoppingCart} alt='cart'/>
          <StyledSpan>0</StyledSpan>
        </div>
      </PositionedCart>
    </StyledUl>
    )
  } else {
    // need to add searchbar
    responsiveNavItems = (
      <StyledUl>
        <StyledMenuDiv>
          <StyledMenu src={menu} alt='menu' />
        </StyledMenuDiv>
        <ResponsiveLogo link='/' exact>
          <StyledLogo src={logo} alt='logo' />
        </ResponsiveLogo>
        <PositionedCartMobile link='/cart'>
          <div>
            <StyledCart src={shoppingCart} alt='cart'/>
            <StyledSpan>0</StyledSpan>
          </div>
        </PositionedCartMobile>
        <SearchBar/>
      </StyledUl>
    )
  }

  return (
    <>
    {responsiveNavItems}
    </>
  )
};

const NavBar = props => {
  return (
    <StyledHead>
      <nav style={{width: '100%'}}>
        <NavItems
          isLoggedIn={props.isLoggedIn}
          logout={props.logout}
          showModal={props.showModal}
          width={props.width}
        />
      </nav>
    </StyledHead>
  );
};

export default NavBar;

const StyledHead = styled.header`
  height: 70px;
  width: 100%;
  ${'' /* position: fixed; */}
  top: 0;
  left: 0;
  display: flex;
  border-bottom: 1px solid black;
  justify-content: space-between;
  align-items: center;
`;

const StyledUl = styled.ul`
  margin: 0;
  padding: 0;
  list-stlye: none;
  ${'' /* display: flex; */}
  ${'' /* flex-flow: row;
  align-items: center; */}
  height: 100%;
  display: grid;
`;

const StyledLi = styled.li`
  margin: 0;
  display: flex;
  ${'' /* height: 100%; */}
  width: auto;
  align-items: center;
`;

const StyledButton = styled.button`
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

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #000;
  height: 100%;
  width: auto;
  padding: 1rem 0.6rem;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
  &:active,
  &.active {
    color: #000;
  }
`;

const StyledLogo = styled.img`
  height: 56px;
`;

const StyledCart = styled.img`
  height: 2rem;
`

const StyledSpan = styled.span`
  position: absolute;
  background: #61e7ee;
  border-radius: 40px;
  width: 20px;
  height: 20px;
  text-align: center;
  top: 8px;
  right: 12px;
`

const StyledMenuDiv = styled.div`
  position: absolute;
  top: 19px;
  left: 20px;

  &:hover {
    cursor: pointer;
  }
`

const StyledMenu = styled.img`
  height: 30px;
`

const PositionedSearchBar = styled(SearchBar)`
  position: absolute;
  left: 280px;
  top: 10px;
`

const PositionedProducts = styled(NavItem)`
  position: absolute;
  right: 286px;
  top: 8px;
`

const PosSignInLogOut = styled(StyledLi)`
  position: absolute;
  right: 138px;
  top: 8px;
  height: auto;
  ${'' /* top: 0px; */}
`

const PositionedCart = styled(NavItem)`
  position: absolute;
  right: 40px;
  top: 0px;
`
const PositionedCartMobile = styled(NavItem)`
  position: absolute;
  right: 20px;
  top: 0px;
`

const ResponsiveLogo = styled(NavItem)`
  margin: auto;
`

//Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
//Icons made by <a href="http://catalinfertu.com/" title="Catalin Fertu">Catalin Fertu</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>