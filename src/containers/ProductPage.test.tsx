import React from 'react';
import { screen, render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

import ProductPage from './ProductPage';

jest.mock('axios');

const product = {
  id: '5fb3fa46760c9c1135ca858c',
  title: 'Fantastic Wooden Mouse',
  price: 15.99,
  image: 'https://picsum.photos/400',
  description:
    'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart'
};

describe('ProductPage tests', () => {
  test('renders the page with all product info', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: product }));

    render(
      <MemoryRouter initialEntries={['/product/5fb3fa46760c9c1135ca858c']}>
        <ProductPage />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(screen.getByText(/fantastic/i)).toBeInTheDocument;
    expect(screen.getByText(/15.99/i).closest('h3')).toBeInTheDocument;
    expect(screen.getByText(/new range/i)).toBeInTheDocument;
    expect(screen.getByText('1').selected).toBe(true);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument;
    // screen.debug();
  });

  test('changing the select value works', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: product }));

    render(
      <MemoryRouter initialEntries={['/product/5fb3fa46760c9c1135ca858c']}>
        <ProductPage />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    userEvent.selectOptions(screen.getByRole('combobox'), '4');
    expect(screen.getByText('4').selected).toBe(true);
    expect(screen.getByText('1').selected).toBe(false);
    // screen.debug();
  });

  test('loads an error when the fetch fails', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('failed')));

    render(
      <MemoryRouter initialEntries={['/product/5fb3fa46760c9c1135ca858c']}>
        <ProductPage />
      </MemoryRouter>
    );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(screen.getByText(/cannot find product/i)).toBeInTheDocument;
    screen.debug();
  });
});
