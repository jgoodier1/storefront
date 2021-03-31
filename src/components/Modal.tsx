import React from 'react';
import styled from 'styled-components';

import Backdrop from './Backdrop';
import { useHistory } from 'react-router-dom';

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
  modalClosed?: () => void;
}

interface ContainerProps {
  show: boolean;
}

const Modal: React.FC<ModalProps> = props => {
  const history = useHistory();

  const modalClosed = () => {
    history.push('/');
  };

  return (
    <>
      <Backdrop
        show={props.show}
        clicked={props.modalClosed ? props.modalClosed : modalClosed}
      />
      <Container show={props.show}>
        <CloseButton onClick={props.modalClosed ? props.modalClosed : modalClosed}>
          X
        </CloseButton>
        {props.children}
      </Container>
    </>
  );
};

export default React.memo(
  Modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show && nextProps.children === prevProps.children
);

const Container = styled.div<ContainerProps>`
  position: fixed;
  z-index: 500;
  background-color: white;
  width: 70%;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px black;
  padding: 16px;
  left: 0;
  top: 80px;
  right: 0;
  margin: 0 auto;
  transition: all 0.3s ease-out;
  transform: ${props => (props.show ? 'translateY(0)' : 'translateY(-150vh)')};
  opacity: ${props => (props.show ? '1' : '0')};

  @media (min-width: 600px) {
    width: 500px;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 6px;
  right: 10px;
  border: 0;
  width: 60px;
  height: 60px;
  font-size: 1.75rem;
  font-weight: bold;
  background-color: white;
  cursor: pointer;
  width: fit-content;
`;
