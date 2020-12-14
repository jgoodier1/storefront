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
        <StyledXButton onClick={props.modalClosed ? props.modalClosed : modalClosed}>
          X
        </StyledXButton>
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

const StyledXButton = styled.button`
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

// const StlyedModal = styled.div`
//   position: fixed;
//   z-index: 500;
//   background-color: white;
//   width: 70%;
//   border: 1px solid #ccc;
//   box-shadow: 1px 1px 1px black;
//   padding: 16px;
//   left: 15%;
//   top: 30%;
//   box-sizing: border-box;
//   transition: all 0.3s ease-out;
//   ${'' /* changed Y to X because the modal was blocking the nav buttons */}
//   transform: ${props => (props.show ? 'translateY(0)' : 'translateY(-100vh)')};
//   opacity: ${props => (props.show ? '1' : '0')};

//   @media (min-width: 600px) {
//     width: 500px;
//     left: calc(50% - 250px);
//   }
// `;

// const Modal = props => {
//   return (
//     <>
//       <Backdrop clicked={props.modalClosed} show={props.show} />
//       <StlyedModal>{props.children}</StlyedModal>
//     </>
//   );
// };
