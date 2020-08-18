import React from 'react';
import styled from 'styled-components';

const Button = (props) => {
  return <StyledButton onClick={props.clicked}>{props.children}</StyledButton>;
};

export default Button;

const StyledButton = styled.button`
  padding: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  font-family: inherit;
  background-color: white;
  border: 3px solid #38689e;
  color: #38689e;
  margin-right: 20px;

  &:hover {
    background-color: #38689e;
    color: white;
    cursor: pointer;
  }
`;
