import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = ({ authenticated }) => {
  const navigate = useNavigate();

  const handleRedirect = (path) => {
    if (!authenticated) {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="#" onClick={() => handleRedirect('/')}>
        Vehicle Management System
      </Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="#" onClick={() => handleRedirect('/dashboard')}>
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
