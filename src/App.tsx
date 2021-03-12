import React, { useState, useContext, Suspense } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

import Products from './containers/Products';
import NavBar from './components/NavBar';
import ProductPage from './containers/ProductPage';
import Auth from './containers/Auth';
import NotFound from './containers/NotFound';
import CartContext from './context/cartContext';
import Search from './containers/Search';
import Home from './containers/Home';
import Spinner from './components/Spinner';
const Cart = React.lazy(() => import('./containers/Cart'));
const Checkout = React.lazy(() => import('./containers/Checkout'));
const Orders = React.lazy(() => import('./containers/Orders'));

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
      <Route
        path='/cart'
        render={() => (
          <Suspense fallback={<Spinner />}>
            <Cart />
          </Suspense>
        )}
      />
      <Route path='/admin/products' render={() => <Products />} />
      <Route
        path='/orders'
        render={() => (
          <Suspense fallback={<Spinner />}>
            <Orders />
          </Suspense>
        )}
      />
      <Route
        path='/checkout'
        render={() => (
          <Suspense fallback={<Spinner />}>
            <Checkout />
          </Suspense>
        )}
      />
      <Route path='/search' component={Search} />
      <Route path='/' exact component={Home} />
      <Route path='*' component={NotFound} />
    </Switch>
  );

  return (
    <div>
      <CartContext.Provider
        value={{ quantity: cartQuantityState, updateQuantity: cartQuantity }}
      >
        <NavBar search={searchHandler} />
        {routes}
      </CartContext.Provider>
      <Auth />
    </div>
  );
};

export default App;
