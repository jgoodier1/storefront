import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import Button from '../../components/Button/Button';

//2. check to see if the inputs are valid types on the front-end

//6. if fail, keep the form with the submitted info and display an error message saying what happened
//8. create a logout button that removes the cookies/session
//9. make a 'forgot your password' button

const Auth = (props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === '/signin') {
      setIsSignUp(false);
    } else if (location.pathname === '/signup') {
      setIsSignUp(true);
    }
  }, [location.pathname]);

  const onSubmitHandler = (event) => {
    event.preventDefault();
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
          console.log('res.data', res.data);
          setIsLoggedIn(true);
        })
        .then(() => {
          history.push('/products'); //change this
        })
        .catch((err) => {
          console.error('err', err);
        });
    } else if (!isSignUp) {
      const user = {
        email: email,
        password: password,
      };
      axios
        .post('/signin', user)
        .then((res) => {
          console.log('res.data', res.data);
          setIsLoggedIn(true);
        })
        .then(() => history.push('/products')) //change this
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <StyledForm onSubmit={onSubmitHandler}>
      {isSignUp ? <h1>Sign Up</h1> : <h1>Sign In</h1>}
      {isSignUp && (
        <StyledLabel>
          Name
          <br />
          <StyledInput
            name='name'
            value={name}
            type='text'
            onChange={(e) => setName(e.target.value)}
          />
        </StyledLabel>
      )}
      <StyledLabel>
        Email
        <br />
        <StyledInput
          name='email'
          value={email}
          type='email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </StyledLabel>
      <StyledLabel>
        Password
        <br />
        <StyledInput
          name='password'
          value={password}
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </StyledLabel>
      {isSignUp && (
        <StyledLabel>
          Confim Password
          <br />
          <StyledInput
            name='confirmPassword'
            value={confirmPassword}
            type='password'
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </StyledLabel>
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

const StyledInput = styled.input`
  font-family: inherit;
  font-size: 100%;
  ${'' /* padding: 1em; */}
  width: 15em;
  margin: 0.5em;
  border: 1px solid #cfd3d7;
`;

const StyledLabel = styled.label`
  font-family: inherit;
  font-size: 100%;
  padding-top: 0.5em;
`;

//1. make the form (probably want name, email, and pass for s-u, just email and pass for s-i)
//3. send to back-end to check if they're valid there (and don't/do exist (depending on s-u of s-i))
//4. back-end sends the response saying yay or nay
//5. if success, redirect somewhere (depending on where they came from)
//7. store cookies or session on the browser if logged in
