import React from 'react';
import styled from 'styled-components';

import Button from './Button';

interface PaginatorProp {
  next: () => void;
  previous: () => void;
  page: number;
  finalPage: number;
  className?: string;
}

const Paginator: React.FC<PaginatorProp> = props => {
  return (
    <StyledDiv className={props.className}>
      {props.page > 1 && <PrevButton clicked={props.previous}>Previous</PrevButton>}
      {props.page < props.finalPage && <NextButton clicked={props.next}>Next</NextButton>}
    </StyledDiv>
  );
};

export default Paginator;

const StyledDiv = styled.div`
  position: relative;
`;

const PrevButton = styled(Button)`
  position: absolute;
  left: 0;
`;

const NextButton = styled(Button)`
  position: absolute;
  right: 0;
`;
