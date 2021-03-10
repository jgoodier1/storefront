import React, { useState, useContext } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import Products from './containers/Products';
import NavBar from './components/NavBar';
import ProductPage from './containers/ProductPage';
import Cart from './containers/Cart';
import Checkout from './containers/Checkout';
import Auth from './containers/Auth';
import Orders from './containers/Orders';
import NotFound from './containers/NotFound';
import CartContext from './context/cartContext';
import Search from './containers/Search';
import Home from './containers/Home';

interface CartInterface {
  products: {
    prodId: string;
    price: number;
    quantity: number;
  }[];
  subTotal: number;
}

interface SearchValues {
  search: string;
}

const App: React.FC = () => {
  const cartContext = useContext(CartContext);
  const [cartQuantityState, setCartQuantityState] = useState(cartContext.quantity);
  const [promise] = useState(() =>
    loadStripe(
      'pk_test_51HKOZDEVSid6nUScxcOBQFjklW1uXACqD8rLvnyLU9HslaRYixM4qQ0gzxz6YaqIxyDITov9Vfxcxvyrinisbnf400FIRya1kL'
    )
  );

  axios.defaults.baseURL = 'https://immense-earth-76647.herokuapp.com';

  const history = useHistory();

  const cartQuantity = (cart: CartInterface) => {
    if (cart === null) {
      setCartQuantityState(0);
    } else {
      const quantity = cart.products.map(p => p.quantity);
      setCartQuantityState(quantity.reduce((a: number, b: number) => a + b));
    }
  };

  const searchHandler = (values: SearchValues) => {
    history.push('/search?value=' + values.search);
  };

  const routes = (
    <Switch>
      <Route path='/products/:id' component={ProductPage} />
      <Route path='/products' component={Products} />
      <Route path='/cart' component={Cart} />
      <Route path='/admin/products' render={() => <Products />} />
      <Route path='/orders' component={Orders} />
      <Route path='/checkout' component={Checkout} />
      <Route path='/search' component={Search} />
      <Route path='/' exact component={Home} />
      <Route path='*' component={NotFound} />
    </Switch>
  );

  return (
    <div>
      <Elements stripe={promise}>
        <CartContext.Provider
          value={{ quantity: cartQuantityState, updateQuantity: cartQuantity }}
        >
          <NavBar search={searchHandler} />
          {routes}
        </CartContext.Provider>
        <Auth />
      </Elements>
    </div>
  );
};

export default App;
