import React from 'react';
import NavItems from './NavItems/NavItems';
import styled from 'styled-components';

const NavBar = () => {
  return (
    <StyledHead>
      <nav>
        <NavItems />
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
