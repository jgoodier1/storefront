import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as actions from '../../../store/actions';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const onLogout = () => dispatch(actions.logout());
    onLogout();
  }, [dispatch]);

  return <Redirect to='/' />;
};

export default Logout;
