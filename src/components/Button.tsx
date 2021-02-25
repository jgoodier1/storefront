import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  clicked?: (e: React.FormEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = props => {
  return (
    <StyledButton className={props.className} onClick={props.clicked} type={props.type}>
      {props.children}
    </StyledButton>
  );
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

  &:hover {
    background-color: #000;
    color: white;
    cursor: pointer;
  }
`;
