import React from 'react';
import styled from 'styled-components';

const Input = (props) => {
  let inputElement = null;

  switch (props.elementType) {
    case 'input':
      inputElement = (
        <StyledInput
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case 'textarea':
      inputElement = (
        <StyledTextArea
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
          rows='8'
        />
      );
      break;
    default:
      inputElement = (
        <StyledInput
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
  }
  return (
    <div>
      <StyledLabel>{props.label}</StyledLabel>
      <br />
      {inputElement}
    </div>
  );
};

export default Input;

const StyledInput = styled.input`
  font-family: inherit;
  font-size: 100%;
  ${'' /* padding: 1em; */}
  width: 15em;
  margin: 0.5em;
  border: 1px solid #cfd3d7;
`;

const StyledTextArea = styled.textarea`
  font-family: inherit;
  font-size: 100%;
  width: 15em;
  ${'' /* padding: 5em; */}
  margin: 0.5em;
  border: 1px solid #cfd3d7;
`;

const StyledLabel = styled.label`
  font-family: inherit;
  font-size: 100%;
  padding-top: 0.5em;
`;
