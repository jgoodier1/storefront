import React from 'react';
import styled from 'styled-components';

interface BackdropProps {
  show: boolean;
  clicked: () => void;
}

const Backdrop: React.FC<BackdropProps> = props =>
  props.show ? <Container onClick={props.clicked}></Container> : null;

export default Backdrop;

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;
