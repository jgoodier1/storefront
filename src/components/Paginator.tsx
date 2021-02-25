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
    <Container className={props.className}>
      {props.page > 1 && (
        <PreviousButton clicked={props.previous}>Previous</PreviousButton>
      )}
      {props.page < props.finalPage && <NextButton clicked={props.next}>Next</NextButton>}
    </Container>
  );
};

export default Paginator;

const Container = styled.div`
  position: relative;
`;

const PreviousButton = styled(Button)`
  position: absolute;
  left: 0;
`;

const NextButton = styled(Button)`
  position: absolute;
  right: 0;
`;
