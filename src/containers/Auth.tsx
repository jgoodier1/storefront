import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import axios from 'axios';

import { Input } from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { logIn, logout, hideModal, selectModalState } from '../reduxSlices/authSlice';

interface IAuthData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}
interface AuthError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<AuthError[] | null>(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const showModal = useSelector(selectModalState);

  const signUpSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too short! Name has to be between 2 and 50 characters')
      .max(50, 'Too long! Name has to be between 2 and 50 characters')
      .required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string()
      .min(5, 'Too short! Password must be between 5 and 20 characters')
      .max(20, 'Too long! Password must be between 5 and 20 characters')
      .required('Password is required'),
    confirmPassword: Yup.string().required('Please confirm your password')
    // .oneOf([Yup.ref('password'), null], "Passwords don't match")
  });

  const loginSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string()
      .min(5, 'Too short! Password must be between 5 and 20 characters')
      .max(20, 'Too long! Password must be between 5 and 20 characters')
      .required('Password is required')
  });

  const validationSchema = isSignUp ? signUpSchema : loginSchema;

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit(values, actions) {
      if (isSignUp) {
        signUpHandler(values);
        if (!authError) actions.resetForm();
      } else if (!isSignUp) {
        loginHandler(values);
        if (!authError) actions.resetForm();
      }
    },
    validationSchema
  });

  useEffect(() => {
    const oldToken = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!oldToken || !expiryDate) {
      return;
    }
    if (new Date(expiryDate) < new Date()) {
      dispatch(logout({ history }));
      return;
    }
    const remainingMilliseconds = new Date(expiryDate).getTime() - new Date().getTime();
    setAutoLogout(remainingMilliseconds);
    dispatch(logIn());
  }, []); //eslint-disable-line

  const signUpHandler = (values: IAuthData) => {
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
          setAuthError(err.response.data);
        }
      });
  };

  const loginHandler = (authData: IAuthData) => {
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
        dispatch(logIn());
        dispatch(hideModal());
      })
      .catch(err => {
        if (err.response) {
          setAuthError(err.response.data);
        }
      });
  };

  const setAutoLogout = useCallback(milliseconds => {
    setTimeout(() => {
      dispatch(logout({ history }));
    }, milliseconds);
  }, []); //eslint-disable-line

  // const showModalHandler = () => {
  //   setShowAuthModal(true); //dispatch(showModal())
  // };

  const modalClosed = () => {
    setAuthError(null);
    dispatch(hideModal());
    setIsSignUp(false);
    formik.resetForm();
  };

  return (
    <Modal show={showModal} modalClosed={() => modalClosed()}>
      <StyledForm onSubmit={formik.handleSubmit}>
        {isSignUp ? <h1>Sign Up</h1> : <h1>Sign In</h1>}
        {isSignUp && (
          <>
            <Input
              id='name'
              name='name'
              label='Name'
              type='text'
              value={formik.values.name}
              changed={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.name && formik.touched.name ? (
              <div>{formik.errors.name}</div>
            ) : null}
          </>
        )}
        <>
          <Input
            id='email'
            name='email'
            label='Email'
            type='email'
            value={formik.values.email}
            changed={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </>
        <>
          <Input
            id='password'
            name='password'
            label='Password'
            type='password'
            value={formik.values.password}
            changed={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password && formik.touched.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </>
        {isSignUp && (
          <>
            <Input
              id='confirmPassword'
              name='confirmPassword'
              label='Confirm Passsword'
              type='password'
              value={formik.values.confirmPassword}
              changed={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
              <div>{formik.errors.confirmPassword}</div>
            ) : null}
          </>
        )}
        {authError && authError.map(e => <p key={e.msg}>{e.msg}</p>)}
        <StyledButton>Submit</StyledButton>
        {!isSignUp && (
          <p>
            Don't have an account?{' '}
            <StyledSwitch onClick={() => setIsSignUp(true)}>Click here</StyledSwitch> to
            sign up
          </p>
        )}
        {isSignUp && (
          <p>
            Already have an account?{' '}
            <StyledSwitch onClick={() => setIsSignUp(false)}>Click here</StyledSwitch> to
            sign in
          </p>
        )}
      </StyledForm>
    </Modal>
  );
};
export default Auth;

const StyledForm = styled.form`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;
  width: auto;
  text-align: center;
`;

const StyledSwitch = styled.button`
  color: #38689e;
  border: none;
  padding: 0;
  background-color: white;
  font-size: inherit;
  font-weight: bold;
  cursor: pointer;
`;

const StyledButton = styled(Button)`
  margin-top: 1rem;
`;
