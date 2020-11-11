import React from 'react';
import styled from 'styled-components';

const Button = (props) => {
  return <StyledButton className={props.className} onClick={props.clicked}>{props.children}</StyledButton>;
};

export default Button;

const StyledButton = styled.button`
  padding: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  background-color: white;
  border: 2px solid #000;
  color: #000;
  ${'' /* margin-right: 20px; */}

  &:hover {
    background-color: #000;
    color: white;
    cursor: pointer;
  }
`;
