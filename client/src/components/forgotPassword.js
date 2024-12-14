import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3000/api/auth/request-password-reset', { email });
      setMessage(data.message);
      setError('');
    } catch (error) {
      let errorMsg = 'Failed to request password reset';
      if (error.response) {
        const responseError = error.response.data.error || '';
        if (error.response.status === 401 && responseError.includes('verify')) {
          errorMsg = 'Please verify your email before requesting a password reset. Check your inbox for the verification link.';
        } else if (error.response.status === 400 && responseError.includes('not exist')) {
          errorMsg = (
            <span>
              User not found. Please <Link to="/signup">sign up</Link>.
            </span>
          );
        } else {
          errorMsg = responseError || 'Failed to request password reset';
        }
      }
      setError(errorMsg);
      setMessage('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Forgot Password</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Request Password Reset</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
