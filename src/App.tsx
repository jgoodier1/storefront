import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import Products from './containers/Products';
import NavBar from './components/NavBar';
import ProductForm from './containers/ProductForm';
import ProductPage from './containers/ProductPage';
import Cart from './containers/Cart';
import Checkout from './containers/Checkout';
import Auth from './containers/Auth';
import Orders from './containers/Orders';
import NotFound from './containers/NotFound';
import CartContext from './context/cartContext';
import Search from './containers/Search';
import Home from './containers/Home';

interface IAuthData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

interface ICart {
  products: {
    prodId: string;
    price: number;
    quantity: number;
  }[];
  subTotal: number;
}

interface MySearchFormValues {
  search: string;
}

interface AuthError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [authError, setAuthErr] = useState<AuthError[] | null>(null);
  const cartContext = useContext(CartContext);
  const [cartQuantityState, setCartQuantityState] = useState(cartContext.quantity);
  const [promise] = useState(() =>
    loadStripe(
      'pk_test_51HKOZDEVSid6nUScxcOBQFjklW1uXACqD8rLvnyLU9HslaRYixM4qQ0gzxz6YaqIxyDITov9Vfxcxvyrinisbnf400FIRya1kL'
    )
  );

  axios.defaults.baseURL = 'https://immense-earth-76647.herokuapp.com';

  const history = useHistory();

  useEffect(() => {
    const oldToken = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!oldToken || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) < new Date()) {
      logoutHandler();
      return;
    }
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    setAutoLogout(remainingMilliseconds);
    setIsLoggedIn(true);
  }, []); //eslint-disable-line

  const signUpHandler = (values: IAuthData) => {
    setIsError(false);
    const newUser = {
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword
    };
    axios
      .post('/signup', newUser, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        // setShowAuthModal(false);
        loginHandler(newUser);
      })
      .catch(err => {
        if (err.response) {
          setAuthErr(err.response.data);
        }
        setIsError(true);
      });
  };

  const loginHandler = (authData: IAuthData) => {
    setIsError(false);
    const user = {
      email: authData.email,
      password: authData.password
    };
    axios
      .post('/signin', user)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        ).toString();
        localStorage.setItem('expiryDate', expiryDate);
        setAutoLogout(remainingMilliseconds);
        setIsLoggedIn(true);
        setShowAuthModal(false);
      })
      .catch(err => {
        if (err.response) {
          setAuthErr(err.response.data);
        }
        setIsError(true);
      });
  };

  const logoutHandler = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiryDate');
    history.push('/');
  };

  const setAutoLogout = useCallback(milliseconds => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  }, []); //eslint-disable-line

  const showModalHandler = () => {
    setShowAuthModal(true);
  };

  const hideModalHandler = () => {
    setShowAuthModal(false);
    setAuthErr(null);
  };

  const cartQuantity = (cart: ICart) => {
    if (cart === null) {
      setCartQuantityState(0);
    } else {
      const quantity = cart.products.map(p => p.quantity);
      setCartQuantityState(quantity.reduce((a: number, b: number) => a + b));
    }
  };

  const searchHandler = (values: MySearchFormValues) => {
    history.push('/search?value=' + values.search);
  };

  const routes = (
    <CartContext.Provider
      value={{ quantity: cartQuantityState, updateQuantity: cartQuantity }}
    >
      <Switch>
        <Route path='/products/:id' component={ProductPage} />
        <Route path='/products' component={Products} />
        <Route path='/cart' component={Cart} />
        <Route path='/admin/add-product' render={() => <ProductForm />} />
        <Route path='/admin/products' render={() => <Products />} />
        <Route path='/admin/edit-product' render={() => <ProductForm />} />
        <Route path='/orders'>
          <Orders isLoggedIn={isLoggedIn} showModal={showModalHandler} />
        </Route>
        <Route path='/checkout'>
          <Checkout isLoggedIn={isLoggedIn} showModal={showModalHandler} />
        </Route>
        <Route path='/search' component={Search} />
        <Route path='/' exact component={Home} />
        <Route path='*' component={NotFound} />
      </Switch>
    </CartContext.Provider>
  );

  return (
    <div>
      <Elements stripe={promise}>
        <CartContext.Provider
          value={{ quantity: cartQuantityState, updateQuantity: cartQuantity }}
        >
          <NavBar
            isLoggedIn={isLoggedIn}
            logout={logoutHandler}
            showModal={showModalHandler}
            search={searchHandler}
          />
        </CartContext.Provider>
        {routes}
        <Auth
          login={loginHandler}
          signUp={signUpHandler}
          show={showAuthModal}
          closedModal={hideModalHandler}
          error={isError}
          authError={authError}
        />
      </Elements>
    </div>
  );
};

export default App;
