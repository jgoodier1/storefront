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

interface AuthProps {
  signUp: (arg1: IAuthData) => void;
  login: (arg1: IAuthData) => void;
  closedModal: () => void;
  show: boolean;
  error: boolean;
}

const Auth: React.FC<AuthProps> = props => {
  const [isSignUp, setIsSignUp] = useState(false);

  const signUpSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too short! Name has to be between 2 and 50 characters')
      .max(50, 'Too long! Name has to be between 2 and 50 characters')
      .required('Name is required'),
    email: Yup.string().email().required('Email is required!'),
    password: Yup.string()
      .min(5, 'Too short! Password must be between 5 and 20 characters')
      .max(20, 'Too long! Password must be between 5 and 20 characters')
      .required('Password is required'),
    confirmPassword: Yup.string().required('Please confirm your password')
    // .oneOf([Yup.ref('password'), null], "Passwords don't match")
  });

  const loginSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required!'),
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
      console.log({ values, actions });
      if (isSignUp) {
        props.signUp(values);
        actions.resetForm();
      } else if (!isSignUp) {
        props.login(values);
        actions.resetForm();
      }
    },
    validationSchema
  });

  // this needs to no close when there's an error after submitting
  const modalClosed = () => {
    props.closedModal();
    setIsSignUp(false);
  };

  return (
    <Modal show={props.show} modalClosed={modalClosed}>
      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledButton onClick={modalClosed} type='button'>
          X
        </StyledButton>
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
        <Button>Submit</Button>
        {!isSignUp && (
          <p>
            Don't have an account?{' '}
            <StyledSwitch onClick={() => setIsSignUp(true)}>Click here</StyledSwitch> to
            sign up
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
  ${'' /* box-shadow: 0 2px 3px #ccc; */}
`;

const StyledButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: 0;
  width: 60px;
  height: 60px;
  font-size: 1.75rem;
  font-weight: bold;
  background-color: white;
  cursor: pointer;
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

//1. make the form (probably want name, email, and pass for s-u, just email and pass for s-i)
//3. send to back-end to check if they're valid there (and don't/do exist (depending on s-u of s-i))
//4. back-end sends the response saying yay or nay
//5. if success, redirect somewhere (depending on where they came from)
//7. store cookies or session on the browser if logged in
//8. create a logout button that removes the cookies/session

//2. check to see if the inputs are valid types on the front-end

//6. if fail, keep the form with the submitted info and display an error message saying what happened
//9. make a 'forgot your password' button
