import React from 'react';
import styled from 'styled-components';

import classes from '../css/Modal.module.css';

const Backdrop = props =>
  props.show ? <StyledBackdrop onClick={props.clicked}></StyledBackdrop> : null;

const Modal = props => {
  return (
    <>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? '1' : '0'
        }}
      >
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

const StyledBackdrop = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
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
