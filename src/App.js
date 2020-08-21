import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Products from './containers/Products/Products';
import NavBar from './components/Navigation/NavBar/NavBar';
import ProductForm from './containers/ProductForm/ProductForm';
import Cart from './containers/Cart/Cart';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';

function App(props) {
  let routes = (
    <Switch>
      <Route path='/products' component={Products} />
      <Route path='/admin/add-product' component={ProductForm} />
      <Route path='/admin/products' component={Products} />
      <Route path='/admin/edit-product' component={ProductForm} />
      <Route path='/cart' component={Cart} />
      <Route path='/signin' component={Auth} />
      <Route path='/signup' component={Auth} />
      <Route path='/logout' component={Logout} />
    </Switch>
  );

  return (
    <div className='App'>
      <NavBar />
      {routes}
    </div>
  );
}

export default App;
