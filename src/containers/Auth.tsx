import React, { useState } from 'react';
import { useFormik } from 'formik';
import styled from 'styled-components';
import * as Yup from 'yup';

import { Input } from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';

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

interface AuthProps {
  signUp: (arg1: IAuthData) => void;
  login: (arg1: IAuthData) => void;
  closedModal: () => void;
  show: boolean;
  error: boolean;
  authError: AuthError[] | null;
}

const Auth: React.FC<AuthProps> = props => {
  const [isSignUp, setIsSignUp] = useState(false);

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
        props.signUp(values);
        if (props.authError) actions.resetForm();
      } else if (!isSignUp) {
        props.login(values);
        if (props.authError) actions.resetForm();
      }
    },
    validationSchema
  });

  const modalClosed = () => {
    props.closedModal();
    setIsSignUp(false);
    formik.resetForm();
  };

  return (
    <Modal show={props.show} modalClosed={() => modalClosed()}>
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
        {props.authError && props.authError.map(e => <p key={e.msg}>{e.msg}</p>)}
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
