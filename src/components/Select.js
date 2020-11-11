import React from 'react';
import styled from 'styled-components';

const Select = (props) => {
  const range = (start, end) => {
    let arr = []
    for (let i = start; i <= end; i++) {
      arr.push(i);
    }
    return arr
  }
  const optionsArray =range(1, props.options)
  const options = optionsArray.map(o =>  <option value={o} key={o}>{o}</option>)
  // console.log(props)

  return (
      <StlyedDiv className={props.className}>
        <StyledSelect name='quantity' id='quantity' value={props.value} onChange={props.changed}>
          {options}
        </StyledSelect>
      </StlyedDiv>
  )
}

export default Select

const StlyedDiv = styled.div`
  display: grid;
  grid-template-areas: 'select';
  align-items: center;
  width: max-content;
  ${'' /* min-width: 15ch; */}
  ${'' /* max-width: 30ch; */}
  border: 2px solid #000;
  padding: 0.25em 0.5em;
  font-size: 1rem;
  cursor: pointer;
  ${'' /* line-height: 1.1; */}
  background-color: #fff;

  :after {
    content: "";
    width: 0.8em;
    height: 0.5em;
    background-color: #000;
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
    grid-area: select;
    justify-self: end;
  }
`

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
`