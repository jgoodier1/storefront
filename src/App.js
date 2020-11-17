import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const cartContext = useContext(CartContext);
  const [cartQuantityState, setCartQuantityState] = useState(cartContext.quantity);
  const [searchValue, setSearchValue] = useState('');

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
    const userId = localStorage.getItem('userId');
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    setToken(oldToken);
    setUserId(userId);
    setAutoLogout(remainingMilliseconds);
    setIsLoggedIn(true);
  }, []); //eslint-disable-line

  const signUpHandler = (event, authData) => {
    event.preventDefault();
    setIsError(false);
    const newUser = {
      name: authData.name,
      email: authData.email,
      password: authData.password,
      confirmPassword: authData.confirmPassword
    };
    axios
      .post('/signup', newUser, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log(res);
        setShowAuthModal(false);
      })
      .catch(err => {
        console.error('err', err);
        setIsError(true);
      });
  };

  const loginHandler = (event, authData) => {
    event.preventDefault();
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
        const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
        localStorage.setItem('expiryDate', expiryDate);
        setAutoLogout(remainingMilliseconds);
        setIsLoggedIn(true);
        setToken(res.data.token);
        setUserId(res.data.userId);
        setShowAuthModal(false);
      })
      .catch(err => {
        console.log(err);
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
  };

  const cartQuantity = cart => {
    // const cart = JSON.parse(sessionStorage.getItem('cart'));
    if (cart === null) {
      setCartQuantityState(0);
    } else {
      const quantity = cart.products.map(p => p.quantity);
      setCartQuantityState(quantity.reduce((a, b) => a + b));
    }
  };

  const searchHandler = e => {
    e.preventDefault();
    history.push('/search?value=' + searchValue);
    // history.push('/search');
  };

  let routes = (
    <CartContext.Provider
      value={{ quantity: cartQuantityState, updateQuantity: cartQuantity }}
    >
      <Switch>
        <Route path='/products/:id' component={ProductPage} />
        <Route path='/products' component={Products} />
        <Route path='/cart' component={Cart} />
        <Route
          path='/admin/add-product'
          render={() => <ProductForm token={token} userId={userId} />}
        />
        <Route
          path='/admin/products'
          render={() => <Products token={token} userId={userId} />}
        />
        <Route
          path='/admin/edit-product'
          render={() => <ProductForm token={token} userId={userId} />}
        />
        <Route path='/orders'>
          <Orders isLoggedIn={isLoggedIn} showModal={showModalHandler} />
        </Route>
        <Route path='/checkout'>
          <Checkout isLoggedIn={isLoggedIn} showModal={showModalHandler} />
        </Route>
        <Route path='/search' component={Search} />
        {/* <Route path='/login' render={() => <Auth login={loginHandler} />} />
      <Route path='/signup' render={() => <Auth signUp={signUpHandler} />} /> */}
        <Route path='/' exact render={() => <h1>Welcome</h1>} />
        <Route path='*' component={NotFound} />
      </Switch>
    </CartContext.Provider>
  );

  return (
    <div className='App'>
      <CartContext.Provider
        value={{ quantity: cartQuantityState, updateQuantity: cartQuantity }}
      >
        <NavBar
          isLoggedIn={isLoggedIn}
          logout={logoutHandler}
          showModal={showModalHandler}
          search={searchHandler}
          changed={e => setSearchValue(e.target.value)}
          value={searchValue}
          // cartQuantity={cartQuantity}
        />
      </CartContext.Provider>
      {routes}
      <Auth
        login={loginHandler}
        signUp={signUpHandler}
        show={showAuthModal}
        closedModal={hideModalHandler}
        error={isError}
      />
    </div>
  );
}

export default App;
