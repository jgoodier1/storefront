import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NavItem = (props) => {
  return (
    <StyledLi>
      <StyledNavLink to={props.link} exact={props.exact}>
        {props.children}
      </StyledNavLink>
    </StyledLi>
  );
};

export default NavItem;

const StyledLi = styled.li`
  margin: 0;
  display: flex;
  height: 100%;
  width: auto;
  align-items: center;
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
