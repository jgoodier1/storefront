import React from 'react';

const cartQuantity = () => {
  const cart = JSON.parse(sessionStorage.getItem('cart'));
  if (cart === null) {
    return 0;
  }
  const quantity = cart.products.map(p => p.quantity);
  return quantity.reduce((a, b) => a + b);
};

const CartContext = React.createContext({
  quantity: cartQuantity(),
  updateQuantity: () => {}
});

export default CartContext;
