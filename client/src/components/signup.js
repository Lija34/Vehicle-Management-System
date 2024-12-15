import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const [values, setValues] = useState({
    newPassword: "",
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

  const { newPassword, error, message, messageType, showPassword } = values;
  const { token } = useParams();

  const handleChange = name => event => {
    const value = event.target.value;
    setValues({ ...values, error: false, [name]: value });

    if (name === 'newPassword') {
      setShowPasswordStrength(true);
      const updatedStrength = {
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        isLongEnough: value.length >= 8,
        noPersonalInfo: true // You might need to add personal info logic if needed
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
    try {
      const { data } = await axios.post(`https://vehicle-management-system-of9v.onrender.com/api/auth/reset-password/${token}`, { newPassword });
      setValues({ ...values, messageType: 'success', message: 'Password reset successfully!', error: '', newPassword: '' });
    } catch (error) {
      setValues({ ...values, messageType: 'danger', message: error.response?.data?.error || 'An error occurred', error: '' });
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
      <h2 className="text-center mb-4">Reset Password</h2>
      {showMessage()}
      {showError()}
      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">New Password</label>
          <div className="input-group">
            <input
              onChange={handleChange("newPassword")}
              onFocus={() => setShowPasswordStrength(true)}
              onBlur={() => setShowPasswordStrength(false)}
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="newPassword"
              placeholder="Enter your new password"
              value={newPassword}
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
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
