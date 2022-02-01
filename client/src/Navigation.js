import React from 'react';
import { Route, Routes } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import logo from './assets/logo.svg';
import LoginHeader from './components/LoginHeader';

export function Navigation() {
  return (
    <Routes>
    <Route path="/login" element={LoginHeader}></Route>
    <Route path="*" element={TopNav} />
    </Routes>
  );
}
const TopNav = (
  <Navbar expand="lg" className="mt-3">
    <Container>
      <LinkContainer to="/">
        <Navbar.Brand href="/">
          <img src={logo} width="200" height="40" className="d-inline-block align-top" alt="👋 see you there" />
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto fw-bold">
          <LinkContainer to="/"><Nav.Link className="text-secondary">home</Nav.Link></LinkContainer>
        </Nav>
      </Navbar.Collapse>
      <LinkContainer to="/login"><Button variant="outline-primary" className="ms-1 fw-bold">login</Button></LinkContainer>
    </Container>
  </Navbar>
);
