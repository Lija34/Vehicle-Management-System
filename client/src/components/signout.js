import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Nav } from 'react-bootstrap';

const Logout = ({ setAuthenticated, setUserRole }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('https://vehicle-management-system-of9v.onrender.com/api/auth/logout', {}, { withCredentials: true });
      document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      document.cookie = 'role=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      setAuthenticated(false);
      setUserRole(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Nav.Link onClick={handleLogout} className="nav-link btn btn-danger">Signout</Nav.Link>
  );
};

export default Logout;
