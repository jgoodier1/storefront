import React from 'react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import Products from './Products';

jest.mock('axios');
// maybe try testing the buttons too? maybe not here

describe('Products', () => {
  const products = [
    {
      _id: '5fb3fa46760c9c1135ca858d',
      title: 'water bottle',
      image: 'https://picsum.photos/400',
      price: 12,
      description: 'lorem ipsum',
      userId: '5f57a5bfbfa31a0d638157d9'
    },
    {
      _id: '5fb3fa46760c9c1135ca858c',
      title: 'a box',
      image: 'https://picsum.photos/400',
      price: 9,
      description: 'lorem ipsum la di da',
      userId: '5f57a5bfbfa31a0d638157d9'
    }
  ];

  test('loads the products', async () => {
    // axios.get.mockImplementationOnce('/products');
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: products }));

    render(
      <MemoryRouter initialEntries={['/products']}>
        <Products />
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    screen.debug();

    expect(await screen.findByText(/water/i)).toBeInTheDocument();
  });

  test('loads error when the http req fails', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('failed')));

    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    // screen.debug();
    expect(await screen.findByText(/Cannot find products/)).toBeInTheDocument();
  });
});
