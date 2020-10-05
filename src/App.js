import React, { useState, useEffect, useCallback } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import axios from 'axios';

import Products from './containers/Products/Products';
import NavBar from './components/NavBar/NavBar';
import ProductForm from './containers/ProductForm/ProductForm';
import ProductPage from './containers/ProductPage/ProductPage';
import Cart from './containers/Cart/Cart';
import Checkout from './containers/Checkout/Checkout';
import Auth from './containers/Auth/Auth';
import Orders from './containers/Orders/Orders';
import NotFound from './containers/NotFound/NotFound';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      });
  };

  const loginHandler = (event, authData) => {
    event.preventDefault();
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

  let routes = (
    <Switch>
      <Route path='/products/:id' component={ProductPage} />
      <Route path='/products' component={Products} />
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
      <Route path='/cart' component={Cart} />
      <Route path='/orders' component={Orders} />
      <Route path='/checkout' component={Checkout} />
      {/* <Route path='/login' render={() => <Auth login={loginHandler} />} />
      <Route path='/signup' render={() => <Auth signUp={signUpHandler} />} /> */}
      <Route path='/' exact render={() => <h1>Welcome</h1>} />
      <Route path='*' component={NotFound} />
    </Switch>
  );

  return (
    <div className='App'>
      <NavBar
        isLoggedIn={isLoggedIn}
        logout={logoutHandler}
        showModal={showModalHandler}
      />
      {routes}
      <Auth
        login={loginHandler}
        signUp={signUpHandler}
        show={showAuthModal}
        closedModal={hideModalHandler}
      />
    </div>
  );
}

export default App;
