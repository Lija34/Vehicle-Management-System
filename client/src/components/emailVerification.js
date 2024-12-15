import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';

const VerifyEmail = () => {
  const { token } = useParams();
  const history = useHistory();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await axios.get(`https://vehicle-management-system-of9v.onrender.com/api/auth/verify/${token}`);
        setMessage(data.message);
        setTimeout(() => {
          history.push('/login');
        }, 3000); // Redirect to login after 3 seconds
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error verifying email');
      }
    };

    verifyEmail();
  }, [token, history]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Email Verification</h2>
      <div className={`alert alert-${message.includes('successfully') ? 'success' : 'danger'}`} role="alert">
        {message}
      </div>
    </div>
  );
};

export default VerifyEmail;
