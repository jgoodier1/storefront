import axios from 'axios';
import * as actionTypes from './actionTypes';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const authSuccess = () => {
  return {
    type: actionTypes.AUTH_SUCCESS,
  };
};

export const authLogout = () => {
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch(authLogout());
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    axios
      .post('/logout')
      .then((res) => console.log(res.data))
      .catch((err) => console.error(err));
  };
};

export const auth = (name, email, password, confirmPassword, isSignUp) => {
  return (dispatch) => {
    dispatch(authStart());
    if (isSignUp) {
      const newUser = {
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      };
      axios
        .post('/signup', newUser)
        .then((res) => {
          localStorage.setItem('token', res.data.token);
          // localStorage.setItem('expirationDate', res.data.expirationDate);
          // localStorage.setItem('userId', res.data.userId);
          console.log('res.data', res.data);
          dispatch(authSuccess());
        })
        // .then(() => {
        //   history.push('/products'); //change this
        // })
        .catch((err) => {
          console.error('err', err);
          dispatch(authFail(err));
        });
    } else if (!isSignUp) {
      const user = {
        email: email,
        password: password,
      };
      axios
        .post('/signin', user)
        .then((res) => {
          localStorage.setItem('token', res.data.token);
          // localStorage.setItem('token', res.data.idToken);
          // localStorage.setItem('expirationDate', res.data.expirationDate);
          // localStorage.setItem('userId', res.data.userId);
          dispatch(authSuccess());
        })
        // .then(() => history.push('/products')) //change this
        .catch((err) => {
          console.log(err);
          dispatch(authFail(err));
        });
    }
  };
};
