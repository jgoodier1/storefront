import React from 'react';
import styled from 'styled-components';

interface SelectProps {
  options: number | string[];
  name: string;
  changed?: (e: React.FormEvent<HTMLSelectElement>) => void;
  value?: number | string;
  className?: string;
}

const Select: React.FC<SelectProps> = props => {
  let options;

  if (typeof props.options === 'number') {
    const range = (start: number, end: number) => {
      const arr = [];
      for (let i = start; i <= end; i++) {
        arr.push(i);
      }
      return arr;
    };
    const optionsArray = range(1, props.options);
    options = optionsArray.map(o => (
      <option value={o} key={o}>
        {o}
      </option>
    ));
  } else {
    options = props.options.map(o => (
      <option value={o} key={o}>
        {o}
      </option>
    ));
  }

  return (
    <Container className={props.className}>
      <StyledSelect
        name={props.name}
        id={props.name}
        value={props.value}
        onChange={props.changed}
      >
        {options}
      </StyledSelect>
    </Container>
  );
};

export default Select;

const Container = styled.div`
  display: grid;
  grid-template-areas: 'select';
  align-items: center;
  width: max-content;
  border: 2px solid #000;
  padding: 0.25em 0.5em;
  font-size: 1rem;
  cursor: pointer;
  background-color: #fff;

  :after {
    content: '';
    width: 0.8em;
    height: 0.5em;
    background-color: #000;
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    grid-area: select;
    justify-self: end;
  }
`;

const StyledSelect = styled.select`
  appearance: none;
  background-color: transparent;
  border: none;
  padding: 0 1em 0 0;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  cursor: inherit;
  line-height: inherit;
  grid-area: select;
`;
