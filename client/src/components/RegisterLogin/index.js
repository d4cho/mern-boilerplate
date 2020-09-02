import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../actions/user_actions';
import { Link } from 'react-router-dom';

const RegisterLogin = (props) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitForm = (event) => {
    event.preventDefault();

    let dataToSubmit = {
      email,
      password
    };

    if (isFormValid(email, password)) {
      setErrors([]);

      dispatch(loginUser(dataToSubmit)).then((response) => {
        if (response.payload.loginSuccess) {
          props.history.push('/');
        } else {
          setErrors(
            errors.concat('Failed to login. Please check email and password.')
          );
        }
      });
    } else {
      setErrors(errors.concat('Form is not valid.'));
    }
  };

  const isFormValid = (email, password) => email && password;

  const displayErrors = (errors) => {
    return errors.map((error, i) => <p key={i}>{error}</p>);
  };

  return (
    <div className='container'>
      <h2>Login</h2>
      <div className='row'>
        <form className='col s12' onSubmit={(event) => submitForm(event)}>
          <div className='row'>
            <div className='input-field col s12'>
              <input
                name='email'
                value={email}
                onChange={(e) => emailChangeHandler(e)}
                id='email'
                type='email'
                className='validate'
              />
              <label className='active' htmlFor='email'>
                Email
              </label>
              <span
                className='helper-text'
                data-error='Email address error'
                data-success='Right'
              />
            </div>
          </div>
          <div className='row'>
            <div className='input-field col s12'>
              <input
                name='password'
                value={password}
                onChange={(e) => passwordChangeHandler(e)}
                id='password'
                type='password'
                className='validate'
              />
              <label className='active' htmlFor='password'>
                Password
              </label>
              <span
                className='helper-text'
                data-error='Wrong'
                data-success='Right'
              />
            </div>
          </div>
          {errors.length > 0 && <div>{displayErrors(errors)}</div>}
          <div className='row'>
            <div className='col s12'>
              <button
                className='btn waves-effect red lighte-2'
                type='submit'
                name='action'
                onClick={(event) => submitForm(event)}>
                Login
              </button>
              &nbsp;&nbsp;
              <Link to='/register'>
                <button
                  className='btn waves-effect red lighte-2'
                  type='submit'
                  name='action'>
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterLogin;
