import React, { useContext } from 'react';
import {
  Route, Routes, useNavigate,
} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Navbar, Container, Nav, Button,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import logo from './assets/cya.svg';
import LoginHeader from './components/LoginHeader';
import { UserContext } from './utils/context';

export function Navigation({ onLogout }) {
  return (
    <Routes>
      <Route path="/login" element={LoginHeader} />
      <Route path="/signup" element={LoginHeader} />
      <Route path="*" element={<TopNav onLogout={onLogout} />} />
    </Routes>
  );
}

export function ProtectedNav() {
  const { user } = useContext(UserContext);
  if (user) {
    return (
      <>
        <LinkContainer to="/">
          <Nav.Link
            className="text-secondary"
          >
            home
          </Nav.Link>
        </LinkContainer>
      </>
    );
  }
  return (null);
}
export function TopNav({ onLogout }) {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const logout = () => {
    onLogout().then(() => {
      navigate('/');
    }).catch((err) => {
      console.log(err);
      navigate('/');
    });
  };
  return (
    <Navbar expand="lg" className="mt-3">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand href="/">
            <img
              src={logo}
              width="100"
              height="40"
              className="d-inline-block align-top"
              alt="👋 cya"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto fw-bold">

            <ProtectedNav />
          </Nav>
        </Navbar.Collapse>
        {user
          // <LinkContainer to="/logout">
          ? (
            <Button
              onClick={logout}
              variant="outline-primary"
              className="ms-3 fw-bold"
            >
              sign out
            </Button>
          )
          // </LinkContainer> */
          : (
            <LinkContainer to="/login">
              <Button
                variant="outline-primary"
                className="ms-1 fw-bold"
              >
                sign in
              </Button>
            </LinkContainer>
          )}
      </Container>
    </Navbar>
  );
}
Navigation.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

TopNav.propTypes = {
  onLogout: PropTypes.func.isRequired,
};
