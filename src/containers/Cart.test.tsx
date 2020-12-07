// doesn't work yet
// not sure how to get passed sessionStorage
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { screen, render } from '@testing-library/react';

import Cart from './Cart';

jest.mock('axios');

const storageCart = {
  products: [
    {
      title: 'Rustic Granite Chicken',
      quantity: 1,
      price: 25
    }
  ],
  subTotal: 25
};

const cart = [
  {
    image: 'https://picsum.photos/400',
    price: 25,
    prodId: '5fb3fa46760c9c1135ca858d',
    quantity: 1,
    title: 'Rustic Granite Chicken'
  }
];

describe('Cart Tests', () => {
  test('renders the cart', async () => {
    sessionStorage.getItem.mockImplementationOnce(() => storageCart);
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: cart }));

    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    // expect(await screen.findByText(/rustic/i)).toBeInTheDocument;
    screen.debug();
  });
});
