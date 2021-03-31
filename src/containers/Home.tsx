import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Spinner from '../components/Spinner';
import Button from '../components/Button';
import useFetch from '../hooks/useFetch';
import { addToCart } from '../utils/addToCart';
import CartContext from '../context/cartContext';

interface Product {
  prod_id: string;
  image: string;
  price: number;
  title: string;
  description: string;
}
interface ICart {
  products: {
    prodId: string;
    price: number;
    quantity: number;
  }[];
  subTotal: number;
}

const Home: React.FC = () => {
  const [scrollLeft, setScrollLeft] = useState(0);
  const [products, compState] = useFetch<Product[]>('GET', '/home');
  const cartContext = useContext(CartContext);
  const history = useHistory();

  const addToCartHandler = (
    id: string,
    price: number,
    quant: number,
    updateFn: (cart: ICart) => void
  ) => {
    addToCart(id, price, quant, updateFn);
    history.push('/cart');
  };

  let recommendedProducts: JSX.Element | JSX.Element[] = <Spinner />;
  if (products !== undefined && products !== null && compState === 'Rendered') {
    recommendedProducts = products.map((product, index) => {
      return (
        <CarouselItem key={product.prod_id} id={index.toString()}>
          <Link to={`/products/${product.prod_id}`}>
            <img src={product.image} alt='' />
          </Link>
          <h3>
            <ProductLink to={`/products/${product.prod_id}`}>{product.title}</ProductLink>
          </h3>
          <p>${product.price}</p>
          <Button
            clicked={() =>
              addToCartHandler(
                product.prod_id,
                product.price,
                1,
                cartContext.updateQuantity
              )
            }
          >
            ADD TO CART
          </Button>
        </CarouselItem>
      );
    });
  } else if (compState === 'Error') recommendedProducts = <div></div>;

  // not the ideal way to do this, but it's a start
  const nextProducts = (direction: 'NEXT' | 'PREVIOUS') => {
    if (!Array.isArray(recommendedProducts) || recommendedProducts === undefined) return;
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    if (
      (direction === 'NEXT' && scrollLeft === 4320) ||
      (direction === 'PREVIOUS' && scrollLeft === 0)
    ) {
      return;
    } else if (direction === 'NEXT') {
      setScrollLeft(prevState => prevState + 270);
      carousel.scrollLeft = scrollLeft + 270;
    } else if (direction === 'PREVIOUS') {
      setScrollLeft(prevState => prevState - 270);
      carousel.scrollLeft = scrollLeft - 270;
    }
  };

  return (
    <Main>
      <Panel>
        <Header>
          <h2>Find the Hottest Products at the Lowest Prices</h2>
          <ExtendedLink to='/products'>View All Products {'>>'}</ExtendedLink>
        </Header>

        <ImageContainer>
          <img
            src='https://burst.shopifycdn.com/photos/young-hip-woman-at-carnival_925x.jpg'
            alt=''
          />
        </ImageContainer>
      </Panel>
      <CarouselContainer>
        <h2>Recommended Products</h2>
        <CarouselContainerInner>
          <SvgButton onClick={() => nextProducts('PREVIOUS')}>
            <svg width='20' height='40' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <polyline
                points='20, 0 0, 20 20, 40'
                stroke='black'
                fill='transparent'
                strokeWidth='2'
              />
            </svg>
          </SvgButton>
          <Carousel
            onScroll={e => setScrollLeft((e.target as Element).scrollLeft)}
            id='carousel'
          >
            {recommendedProducts}
          </Carousel>
          <SvgButton onClick={() => nextProducts('NEXT')}>
            <svg width='20' height='40' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <polyline
                points='0, 0 20, 20 0, 40'
                stroke='black'
                fill='transparent'
                strokeWidth='2'
              />
            </svg>
          </SvgButton>
        </CarouselContainerInner>
      </CarouselContainer>
    </Main>
  );
};

export default Home;

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr min(120ch, 100%) 1fr;
  padding: 3rem 2rem 5rem;

  & > * {
    grid-column: 2;
  }
`;

const Panel = styled.section`
  grid-column: 1/4;
  border: 1px solid black;
  display: grid;
  grid-template-rows: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: 2fr 3fr;
    grid-template-rows: 1fr;
  }
`;

const Header = styled.header`
  display: grid;
  align-content: center;
  justify-items: center;
  grid-row: 2;
  grid-column: 1/3;

  @media (min-width: 640px) {
    grid-row: 1;
    grid-column: 1/2;
  }

  & > h2 {
    text-align: center;
    width: fit-content;
  }
`;

const ExtendedLink = styled(Link)`
  color: #38689e;
  text-decoration: none;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`;

const ImageContainer = styled.div`
  grid-column: 1/3;
  grid-row: 1;

  @media (min-width: 640px) {
    grid-column: 2/3;
    grid-row: 1;
  }

  & > img {
    display: block;
    width: 100%;
  }
`;

const CarouselContainer = styled.section`
  width: 100%;

  & > h2 {
    padding-left: 2.2rem;
  }
`;

const CarouselContainerInner = styled.div`
  overflow: hidden;
  display: flex;
`;

const Carousel = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behaviour: smooth;
  -webkit-overflow-scrolling: touch;
`;

const CarouselItem = styled.div`
  scroll-snap-align: start;
  width: calc(50% - 10px);
  flex-shrink: 0;
  padding-bottom: 10px;

  @media (min-width: 640px) {
    width: calc(25% - 10px);
  }

  & img {
    width: 100%;
  }
`;

const ProductLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const SvgButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  margin-top: -140px;
`;
