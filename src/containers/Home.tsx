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
  const [carouselPage, setCarouselPage] = useState(1);
  const [products] = useFetch<Product[]>('GET', '/home');
  const cartContext = useContext(CartContext);
  const history = useHistory();

  // console.log(products);

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
  if (products !== undefined && products !== null) {
    recommendedProducts = products.map(product => {
      // if (index > 3) return <></>;
      return (
        <CarouselItem key={product.prod_id}>
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
  }

  const nextProducts = (direction: 'NEXT' | 'PREVIOUS') => {
    if (!Array.isArray(recommendedProducts) || recommendedProducts === undefined) return;
    if (direction === 'NEXT' && carouselPage === 4) {
      setCarouselPage(1);
    } else if (direction === 'PREVIOUS' && carouselPage === 1) {
      setCarouselPage(4);
    } else if (direction === 'NEXT') {
      setCarouselPage(carouselPage + 1);
    } else if (direction === 'PREVIOUS') {
      setCarouselPage(carouselPage - 1);
    }
  };
  console.log(recommendedProducts);

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
        <Carousel>
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
          {recommendedProducts}
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
        </Carousel>
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
  grid-template-columns: 2fr 3fr;
`;

const Header = styled.header`
  display: grid;
  align-content: center;
  justify-items: center;

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
  grid-column: 2/3;

  & > img {
    display: block;
    width: 100%;
  }
`;

const CarouselContainer = styled.section`
  width: 100%;

  & > h2 {
    padding-left: 2.8rem;
  }
`;

const Carousel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CarouselItem = styled.div`
  width: calc(25% - 16px);
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
