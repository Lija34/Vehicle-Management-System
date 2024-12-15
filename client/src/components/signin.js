import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ setAuthenticated, setUserRole }) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    showPassword: false
  });

  const { email, password, loading, error, showPassword } = values;

  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const toggleShowPassword = () => {
    setValues({ ...values, showPassword: !showPassword });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true });
    try {
      console.log('Submitting login:', { email, password });
      const response = await axios.post('https://vehicle-management-system-of9v.onrender.com/api/auth/login', { email, password }, { withCredentials: true });
      console.log('Login response:', response.data);
      setValues({ ...values, loading: false });
      setAuthenticated(true);
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      let errorMsg = 'Failed to login';
      if (error.response) {
        const responseError = error.response.data.message || '';
        if (error.response.status === 401 && responseError.includes('verify')) {
          errorMsg = 'Please verify your email before logging in. Check your inbox for the verification link.';
        } else if (error.response.status === 400 && responseError.includes('not exist')) {
          errorMsg = (
            <span>
              User not found. Please <Link to="/signup">sign up</Link>.
            </span>
          );
        } else {
          errorMsg = responseError || 'Failed to login';
        }
      }
      setValues({ ...values, error: errorMsg, loading: false });
    }
  };

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Signin</h2>
      {showLoading()}
      {showError()}
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={email}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-group">
            <input
              onChange={handleChange("password")}
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              required
            />
            <div className="input-group-append">
              <span className="input-group-text" onClick={toggleShowPassword} style={{ cursor: "pointer" }}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">Signin</button>
        <div className="mt-3 text-center">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
