import React from 'react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import Orders from './Orders';

jest.mock('axios');

const orders = [
  {
    _id: '5fb439901315cb25852ca5ab',
    products: [
      {
        _id: '5fb3fa46760c9c1135ca858d',
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
        _id: '5fb3fa46760c9c1135ca858c',
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
  },
  {
    _id: '5fbd2169dc3af70843bfea46',
    products: [
      {
        _id: '5fb3fa46760c9c1135ca858d',
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
        _id: '5fb3fa46760c9c1135ca858c',
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
    createdAt: '2020-11-18T20:23:34.365+00:00',
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

    expect(await screen.findAllByText(/fantastic/i)).toHaveLength(2);
    screen.debug();
  });
});
