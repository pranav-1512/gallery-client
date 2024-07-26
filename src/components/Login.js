import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

const Login = ({ onLogin }) => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://gallery-backend-u0i7.onrender.com/auth/login', {
        email: email,
        password: password,
      });
      console.log('Response:', res.status);
      if (res.status === 200) {
        localStorage.setItem('authtoken', res.data.authtoken);
        onLogin(); // Update parent component state to reflect logged in status
        navigate('/home');
      } else {
        setAlert({ show: true, message: 'Invalid Credentials.', severity: 'error' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ show: true, message: 'An error occurred. Please try again.', severity: 'error' });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      {alert.show && <Alert severity="error">Invalid Credentials</Alert>}
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-md-6">
            <form className="shadow p-3 rounded" style={{ background: '#f8f9fa' }} onSubmit={handleSubmit}>
              <h2 className="text-center mb-4">Login</h2>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={handleEmailChange} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input type="password" className="form-control" id="password" onChange={handlePasswordChange} required />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary mx-3">
                  Submit
                </button>
                <p className="my-2">
                  Don't have an account? <Link to="/signup">Signup</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
