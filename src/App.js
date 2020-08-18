import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Products from './containers/Products/Products';
import NavBar from './components/Navigation/NavBar/NavBar';
import ProductForm from './containers/ProductForm/ProductForm';
import Cart from './containers/Cart/Cart';

function App(props) {
  let routes = (
    <Switch>
      <Route path='/products' component={Products} />
      <Route path='/admin/add-product' component={ProductForm} />
      <Route path='/admin/products' component={Products} />
      <Route path='/admin/edit-product' component={ProductForm} />
      <Route path='/cart' component={Cart} />
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
