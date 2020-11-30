import React from 'react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { findByText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Orders from './Orders';

jest.mock('axios');

const orders = [
  {
    _id: '5fb439901315cb25852ca5ab',
    products: [
      {
        _id: '5fb3fa46760c9c1135ca858c',
        price: 12,
        prodId: {
          _id: '5fb3fa46760c9c1135ca858c',
          description:
            'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
          image: 'https://picsum.photos/400',
          price: 280,
          title: 'Fantastic Wooden Mouse',
          userId: '5f57a5bfafa31a0d638157d9'
        },
        quantity: 1
      },
      {
        _id: '5fb3fa46760c9c1135ca858d',
        price: 9,
        prodId: {
          _id: '5fb3fa46760c9c1135ca858d',
          description:
            'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart',
          image: 'https://picsum.photos/400',
          price: 10,
          title: 'Rustic Granite Chicken',
          userId: '5f57a5bfafa31a0d638157d9'
        },
        quantity: 1
      }
    ],
    totalPrice: 21,
    createdAt: '2020-11-17T20:58:56.282+00:00',
    contactInfo: {
      city: 'Toronto',
      country: 'Canada',
      firstName: 'Bob',
      lastName: 'Bobson',
      phoneNumber: '4161234567',
      postalCode: 'T0R0N0',
      province: 'Ontario',
      streetAddress: '123 Bob Street',
      streetAddressTwo: ''
    },
    shippingSpeed: 'normal'
  }
];

describe('Orders', () => {
  test('renders the orders', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: orders }));

    render(
      <MemoryRouter>
        <Orders showModal={() => {}} isLoggedIn={true} />
      </MemoryRouter>
    );

    expect(await screen.findByText(/fantastic/i)).toBeInTheDocument;
    expect(await screen.findByText(/rustic/i)).toBeInTheDocument;
    expect(await screen.findByText(/9/i)).toBeInTheDocument;
    expect(await screen.findByText(/12/i)).toBeInTheDocument;
    expect(await screen.findAllByText(/Qty: 1/i)).toHaveLength(2);
    expect(await screen.findByText(/bob/i)).toBeInTheDocument;
    // screen.debug();
  });

  test('contact data appears when hovering "Ship To"', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: orders }));

    render(
      <MemoryRouter>
        <Orders showModal={() => {}} isLoggedIn={true} />
      </MemoryRouter>
    );

    userEvent.hover(await screen.findByText(/ship/i));
    expect(screen.getByText(/toronto/i)).toBeInTheDocument;
    expect(screen.getByText(/ontario/i)).toBeInTheDocument;
    expect(screen.getByText(/T0R0N0/)).toBeInTheDocument;
    expect(screen.getByText(/Canada/i)).toBeInTheDocument;
    userEvent.unhover(screen.getByText(/ship/i));
    expect(screen.queryByText(/toronto/i)).not.toBeInTheDocument;
    expect(screen.queryByText(/ontario/i)).not.toBeInTheDocument;
    expect(screen.queryByText(/T0R0N0/)).not.toBeInTheDocument;
    expect(screen.queryByText(/Canada/i)).not.toBeInTheDocument;
    // screen.debug();
  });

  test('links go to product pages', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve({ data: orders }));

    render(
      <MemoryRouter>
        <Orders showModal={() => {}} isLoggedIn={true} />
      </MemoryRouter>
    );

    await screen.findByText(/rustic/i);
    expect(screen.getByText(/rustic/i).closest('a')).toHaveAttribute(
      'href',
      '/products/5fb3fa46760c9c1135ca858d'
    );
    expect(screen.getByText(/wooden/i).closest('a')).toHaveAttribute(
      'href',
      '/products/5fb3fa46760c9c1135ca858c'
    );
    // screen.debug();
  });

  test('renders error when fetch fails', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject(new Error('failed')));

    render(
      <MemoryRouter>
        <Orders showModal={() => {}} isLoggedIn={true} />
      </MemoryRouter>
    );

    expect(await screen.findByText(/cannot load orders/i)).toBeInTheDocument;
    // screen.debug();
  });

  test('closes modal when user click the "X" button', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject(new Error('failed')));

    render(
      <MemoryRouter>
        <Orders showModal={() => {}} isLoggedIn={true} />
      </MemoryRouter>
    );

    userEvent.click(await screen.findByText(/x/i));
    expect(screen.queryByText(/cannot load orders/i)).not.toBeInTheDocument;
    screen.debug();
  });

  test('prompts user to log in when unauthenticated', () => {
    render(
      <MemoryRouter>
        <Orders showModal={() => {}} isLoggedIn={false} />
      </MemoryRouter>
    );

    expect(screen.getByText(/please sign in/i)).toBeInTheDocument;
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument;
    // screen.debug();
  });
});
