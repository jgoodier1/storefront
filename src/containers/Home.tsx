import React from 'react';
import styled from 'styled-components';

const Home: React.FC = () => {
  return (
    <StyledMain>
      <StyledArticle>
        <header>
          <h1>Welcome to my website!</h1>
        </header>
        <section>
          <p>
            As you might have guessed from the name, this website is a mock e-commerce
            storefront.
          </p>
          <p>
            It is built with a React front-end and an Node/Express back-end with a
            PostgreSQL database.
          </p>
          <p>
            You can view the source code for the front-end{' '}
            <StyledA href='https://github.com/jgoodier1/storefront' target='_blank'>
              here
            </StyledA>{' '}
            and the back-end{' '}
            <StyledA href='https://github.com/jgoodier1/storefront-api' target='_blank'>
              here
            </StyledA>
            . My LinkedIn profile is{' '}
            <StyledA
              href='https://www.linkedin.com/in/jacob-goodier-b64a5586/'
              target='_blank'
            >
              here.
            </StyledA>
          </p>
        </section>
      </StyledArticle>
    </StyledMain>
  );
};

export default Home;

const StyledMain = styled.main`
  display: grid;
  grid-template-columns: 2rem 1fr 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 45rem 1fr;
  }
`;

const StyledArticle = styled.article`
  grid-column: 2/3;
`;

const StyledA = styled.a`
  text-decoration: none;
  color: #3f6cd7;
`;
