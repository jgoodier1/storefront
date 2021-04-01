import React from 'react';
import styled from 'styled-components';

import Button from './Button';

interface PaginatorProps {
  next: () => void;
  previous: () => void;
  page: number;
  finalPage: number;
  className?: string;
}

interface NextButtonProps {
  page: number;
}

const Paginator: React.FC<PaginatorProps> = props => {
  return (
    <Container className={props.className}>
      ;
      {props.page > 1 && (
        <PreviousButton clicked={props.previous}>Previous</PreviousButton>
      )}
      {props.page < props.finalPage && (
        <NextButton page={props.page} clicked={props.next}>
          Next
        </NextButton>
      )}
    </Container>
  );
};

export default Paginator;

const Container = styled.div`
  position: relative;
`;

const PreviousButton = styled(Button)`
  position: relative;
  left: 0;
`;

const NextButton = styled(Button)<NextButtonProps>`
  position: relative;
  /*
    THIS BREAKS IF I EVER CHANGE THE BUTTONS AT ALL
    BUT IT NEEDS TO BE RELATIVE SO THAT I CAN ADD MARGIN BELOW THE COMPONENT
  */
  left: ${props => (props.page === 1 ? 'calc(100% - 58.4px)' : 'calc(100% - 155.2px)')};
`;
