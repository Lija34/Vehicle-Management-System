import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    message: "",
    messageType: "",
    showPassword: false
  });

  const [passwordStrength, setPasswordStrength] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isLongEnough: false,
    noPersonalInfo: true
  });

  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const { name, email, password, error, message, messageType, showPassword } = values;

  const handleChange = name => event => {
    const value = event.target.value;
    setValues({ ...values, error: false, [name]: value });

    if (name === 'password') {
      setShowPasswordStrength(true);
      const personalInfo = [values.name.toLowerCase(), values.email.split('@')[0].toLowerCase()];
      const updatedStrength = {
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        isLongEnough: value.length >= 8,
        noPersonalInfo: !personalInfo.some(info => value.toLowerCase().includes(info))
      };
      setPasswordStrength(updatedStrength);
    }
  };

  const toggleShowPassword = () => {
    setValues({ ...values, showPassword: !showPassword });
  };

  const isPasswordStrong = () => {
    return (
      passwordStrength.hasUpperCase &&
      passwordStrength.hasLowerCase &&
      passwordStrength.hasNumber &&
      passwordStrength.hasSpecialChar &&
      passwordStrength.isLongEnough &&
      passwordStrength.noPersonalInfo
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordStrong()) {
      setValues({ ...values, error: 'Password does not meet strength requirements', messageType: 'danger' });
      return;
    }
    setValues({ ...values, error: false, loading: true });
    try {
      await axios.post('https://vehicle-management-system-of9v.onrender.com/api/auth/register', { name, email, password });
      setValues({ ...values, messageType: 'success', message: 'Account created successfully! Please check your inbox to verify your email.', loading: false, name: '', email: '', password: '' });
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to register user';
      setValues({ ...values, messageType: 'danger', message: errorMsg, loading: false });
    }
  };

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const showMessage = () => (
    message && (
      <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
        {message}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    )
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Signup</h2>
      {showMessage()}
      {showError()}
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            placeholder="Name" 
            value={name} 
            onChange={handleChange("name")} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            placeholder="Email" 
            value={email} 
            onChange={handleChange("email")} 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="input-group">
            <input 
              onChange={handleChange("password")} 
              onFocus={() => setShowPasswordStrength(true)}
              onBlur={() => setShowPasswordStrength(false)}
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
          {showPasswordStrength && (
            <div className="password-strength mt-2">
              <p className={passwordStrength.hasUpperCase ? 'text-success' : 'text-danger'}>
                {passwordStrength.hasUpperCase ? '✓' : '✗'} Uppercase letter
              </p>
              <p className={passwordStrength.hasLowerCase ? 'text-success' : 'text-danger'}>
                {passwordStrength.hasLowerCase ? '✓' : '✗'} Lowercase letter
              </p>
              <p className={passwordStrength.hasNumber ? 'text-success' : 'text-danger'}>
                {passwordStrength.hasNumber ? '✓' : '✗'} Number
              </p>
              <p className={passwordStrength.hasSpecialChar ? 'text-success' : 'text-danger'}>
                {passwordStrength.hasSpecialChar ? '✓' : '✗'} Special character
              </p>
              <p className={passwordStrength.isLongEnough ? 'text-success' : 'text-danger'}>
                {passwordStrength.isLongEnough ? '✓' : '✗'} Minimum 8 characters
              </p>
              <p className={passwordStrength.noPersonalInfo ? 'text-success' : 'text-danger'}>
                {passwordStrength.noPersonalInfo ? '✓' : '✗'} Does not contain personal info
              </p>
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
