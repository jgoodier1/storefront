import React from 'react';
import styled from 'styled-components';

import Backdrop from './Backdrop';
import classes from '../css/Modal.module.css';
import { useHistory } from 'react-router-dom';

interface ModalProps {
  show: boolean;
  children: React.ReactNode;
  modalClosed?: () => void;
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
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-150vh)',
          opacity: props.show ? '1' : '0'
        }}
      >
        <CloseButton onClick={props.modalClosed ? props.modalClosed : modalClosed}>
          X
        </CloseButton>
        {props.children}
      </div>
    </>
  );
};

export default React.memo(
  Modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show && nextProps.children === prevProps.children
);

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
`;
