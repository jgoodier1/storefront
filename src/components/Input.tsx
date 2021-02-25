import React from 'react';
import styled from 'styled-components';

interface InputProps {
  id: string;
  label: string;
  type: string;
  name: string;
  value?: string;
  changed?: (e: React.FormEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FormEvent<HTMLInputElement>) => void;
  checked?: boolean;
  className?: string;
}

interface TextAreaProps {
  name: string;
  label: string;
  id: string;
  value: string;
  changed: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  rows: string;
  className?: string;
}

const Input: React.FC<InputProps> = props => {
  return (
    <div className={props.className}>
      <StyledLabel htmlFor={props.id}>{props.label}</StyledLabel>
      <br />
      <StyledInput
        type={props.type}
        name={props.name}
        id={props.id}
        checked={props.checked}
        value={props.value}
        onChange={props.changed}
        onBlur={props.onBlur}
      />
    </div>
  );
};

const TextArea: React.FC<TextAreaProps> = props => {
  return (
    <div className={props.className}>
      <StyledLabel htmlFor={props.name}>{props.label}</StyledLabel>
      <br />
      <StyledTextArea
        value={props.value}
        onChange={props.changed}
        rows={+props.rows}
        name={props.name}
        id={props.id}
      />
    </div>
  );
};

export { Input, TextArea };

const StyledInput = styled.input`
  font-family: inherit;
  font-size: 100%;
  width: 100%;
  padding-left: 0.5em;
  border: 1px solid #000;
  line-height: 30px;

  :focus {
    outline: none;
  }
`;

const StyledTextArea = styled.textarea`
  font-family: inherit;
  font-size: 100%;
  margin: 0.5em;
  border: 1px solid #000;

  :focus {
    outline: none;
  }
`;

const StyledLabel = styled.label`
  font-family: inherit;
  font-size: 100%;
  padding-top: 0.5em;
  font-weight: bold;
`;
