import React from 'react';
import styled from 'styled-components';

const NotFound: React.FC = () => {
  return (
    <Container>
      <h1>This Page Does Not Exist 😧</h1>
    </Container>
  );
};

export default NotFound;

const Container = styled.main`
  display: grid;
  justify-content: center;
`;
