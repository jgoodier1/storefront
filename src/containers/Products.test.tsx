import React from 'react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import Products from './Products';

jest.mock('axios');
// maybe try testing the buttons too? maybe not here
// do I need to test the navigation buttons??

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
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: { products, totalItems: 5 } })
    );

    render(
      <MemoryRouter initialEntries={['/products?page=1']}>
        <Products />
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(await screen.findByText(/water/i)).toBeInTheDocument();
    // screen.debug();
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

  test('the next button appears when there are more than 10 items', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: { products, totalItems: 13 } })
    );
    render(
      <MemoryRouter initialEntries={['/products?page=1']}>
        <Products />
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    // screen.debug();

    expect(await screen.findByText(/next/i)).toBeInTheDocument();
  });

  test('the previous button appears when on the second page', async () => {
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({ data: { products, totalItems: 13 } })
    );
    render(
      <MemoryRouter initialEntries={['/products?page=2']}>
        <Products />
      </MemoryRouter>
    );
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    // screen.debug();

    expect(await screen.findByText(/previous/i)).toBeInTheDocument();
  });
});
