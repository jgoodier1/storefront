import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

//2. check to see if the inputs are valid types on the front-end

//6. if fail, keep the form with the submitted info and display an error message saying what happened
//9. make a 'forgot your password' button

const Auth = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsSignUp(false);
    } else if (location.pathname === '/signup') {
      setIsSignUp(true);
    }
  }, [location.pathname]);

  const authData = {
    name,
    email,
    password,
    confirmPassword
  };

  const onSubmitHandler = (event, authData) => {
    if (isSignUp) {
      props.signUp(event, authData);
    } else if (!isSignUp) {
      props.login(event, authData);
    }
  };

  return (
    <StyledForm onSubmit={e => onSubmitHandler(e, authData)}>
      {isSignUp ? <h1>Sign Up</h1> : <h1>Sign In</h1>}
      {isSignUp && (
        <Input
          type='text'
          value={name}
          name='name'
          changed={e => setName(e.target.value)}
          label='Name'
        />
      )}
      <Input
        type='email'
        value={email}
        name='email'
        changed={e => setEmail(e.target.value)}
        label='Email'
      />
      <Input
        type='password'
        name='password'
        value={password}
        changed={e => setPassword(e.target.value)}
        label='Password'
      />
      {isSignUp && (
        <Input
          type='password'
          value={confirmPassword}
          name='confirmPassword'
          changed={e => setConfirmPassword(e.target.value)}
          label='Confirm Password'
        />
      )}
      <Button>Submit</Button>
    </StyledForm>
  );
};
export default Auth;

const StyledForm = styled.form`
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: flex-end;
  margin: 100px auto;
  width: 500px;
  text-align: center;
  ${'' /* box-shadow: 0 2px 3px #ccc; */}
  border: 1px solid #eee;
  padding: 10px;
`;

//1. make the form (probably want name, email, and pass for s-u, just email and pass for s-i)
//3. send to back-end to check if they're valid there (and don't/do exist (depending on s-u of s-i))
//4. back-end sends the response saying yay or nay
//5. if success, redirect somewhere (depending on where they came from)
//7. store cookies or session on the browser if logged in
//8. create a logout button that removes the cookies/session
