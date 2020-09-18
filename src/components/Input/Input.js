import React from 'react';
import styled from 'styled-components';

const Input = props => {
  return (
    <div>
      <StyledLabel htmlFor={props.id}>{props.label}</StyledLabel>
      <br />
      <StyledInput
        type={props.type}
        name={props.name}
        id={props.id}
        // required={props.required}
        checked={props.checked}
        value={props.value}
        onChange={props.changed}
      />
    </div>
  );
};

const TextArea = props => {
  return (
    <div>
      <StyledLabel htmlFor={props.name}>{props.label}</StyledLabel>
      <br />
      <StyledTextArea
        // required={props.required}
        value={props.value}
        onChange={props.changed}
        rows={props.rows}
        name={props.name}
      />
    </div>
  );
};

export { Input, TextArea };

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
