import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/signin';
import ForgotPassword from './components/forgotPassword';
import ResetPassword from './components/resetPassword';
import VehicleTable from './components/VehicleTable';
import Logout from './components/signout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav } from 'react-bootstrap';
import { getCookie } from './helpers/cookies';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = getCookie('token');
    const role = getCookie('role');
    
    if (token && role) {
      setAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand as={Link} to="/" onClick={(e) => {
            if (!authenticated) {
              e.preventDefault();
            }
          }}>
            Vehicle Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              {authenticated ? (
                <>
                  <Nav.Link href="#" className="nav-link" onClick={e => e.preventDefault()}>Dashboard</Nav.Link>
                  <Logout setAuthenticated={setAuthenticated} setUserRole={setUserRole} />
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                  <Nav.Link as={Link} to="/login">Signin</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="container mt-4">
          <Routes>
            <Route path="/signup" element={authenticated ? <Navigate to="/" /> : <Signup />} />
            <Route path="/login" element={authenticated ? <Navigate to="/" /> : <Login setAuthenticated={setAuthenticated} setUserRole={setUserRole} />} />
            <Route path="/forgot-password" element={!authenticated ? <ForgotPassword /> : <Navigate to="/" />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route path="/" element={authenticated ? <VehicleTable userRole={userRole} /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
