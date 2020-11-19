import React, { useState /*, useEffect */ } from 'react';
// import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../components/Button';
import { Input } from '../components/Input';
import Modal from '../components/Modal';

interface IAuthData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

interface AuthProps {
  signUp: (arg0: React.FormEvent<HTMLFormElement>, arg1: IAuthData) => void;
  login: (arg0: React.FormEvent<HTMLFormElement>, arg1: IAuthData) => void;
  closedModal: () => void;
  show: boolean;
  error: boolean;
}

const Auth = (props: AuthProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // const location = useLocation();

  const authData = {
    name,
    email,
    password,
    confirmPassword
  };

  const onSubmitHandler = (
    event: React.FormEvent<HTMLFormElement>,
    authData: IAuthData
  ) => {
    if (isSignUp) {
      props.signUp(event, authData);
    } else if (!isSignUp) {
      props.login(event, authData);
    }
  };

  // this needs to no close when there's an error after submitting
  const modalClosed = () => {
    props.closedModal();
    setIsSignUp(false);
  };

  return (
    <Modal show={props.show} modalClosed={modalClosed}>
      <StyledForm onSubmit={e => onSubmitHandler(e, authData)}>
        <StyledButton onClick={modalClosed}>X</StyledButton>
        {isSignUp ? <h1>Sign Up</h1> : <h1>Sign In</h1>}
        {/* shouldn't show error if they changed from signin to signup */}
        {props.error && isSignUp && <p>There was an error</p>}
        {props.error && !isSignUp && <p>Invalid email or password</p>}
        {isSignUp && (
          <Input
            type='text'
            value={name}
            name='name'
            id='name'
            changed={(e: React.FormEvent<HTMLInputElement>) =>
              setName(e.currentTarget.value)
            }
            label='Name'
          />
        )}
        <Input
          type='email'
          value={email}
          name='email'
          id='email'
          changed={(e: React.FormEvent<HTMLInputElement>) =>
            setEmail(e.currentTarget.value)
          }
          label='Email'
        />
        <Input
          type='password'
          name='password'
          id='password'
          value={password}
          changed={(e: React.FormEvent<HTMLInputElement>) =>
            setPassword(e.currentTarget.value)
          }
          label='Password'
        />
        {isSignUp && (
          <Input
            type='password'
            value={confirmPassword}
            name='confirmPassword'
            id='confirmPassword'
            changed={(e: React.FormEvent<HTMLInputElement>) =>
              setConfirmPassword(e.currentTarget.value)
            }
            label='Confirm Password'
          />
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
