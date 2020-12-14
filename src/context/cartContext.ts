import React from 'react';

interface ICart {
  products: {
    prodId: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
}

const cartQuantity = () => {
  const cart: ICart = JSON.parse(sessionStorage.getItem('cart')!);
  if (cart === null || cart.products === undefined) {
    return 0;
  }
  const quantity = cart.products.map(p => p.quantity);
  return quantity.reduce((a: number, b: number) => a + b);
};

const CartContext = React.createContext({
  quantity: cartQuantity(),
  updateQuantity: (cart: any) => {} //eslint-disable-line
});

export default CartContext;
