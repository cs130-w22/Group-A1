import React, { useContext } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import logo from './assets/cya.svg';
import LoginHeader from './components/LoginHeader';
import { UserContext, UserDispatchContext } from './utils/userContext';


export function Navigation() {

    return (
        <Routes>
            {/* TODO add a custom header nav to the login path, or delete this to use the standard header*/}
            <Route path="/login" element={LoginHeader}></Route>
            <Route path="*" element={<TopNav />} />
        </Routes>
    );
}
export function TopNav() {
    const user = useContext(UserContext);
    const { logoutDispatcher } = useContext(UserDispatchContext)
    const navigate = useNavigate();
    const logout = () => {
        logoutDispatcher().then(()=> {
            navigate("/");
        });
    }
    return (
        <Navbar expand="lg" className="mt-3">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand href="/">
                        <img src={logo} width="100" height="40"
                            className="d-inline-block align-top" alt="👋 cya" />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto fw-bold">
                        <LinkContainer to="/"><Nav.Link
                            className="text-secondary">home</Nav.Link></LinkContainer>
                    </Nav>
                </Navbar.Collapse>
                {user ?
                    // <LinkContainer to="/logout">
                        <Button
                            onClick={logout}
                            variant="outline-primary"
                            className="ms-1 fw-bold">sign out</Button>
                    // </LinkContainer> */
                    :
                    <LinkContainer to="/login">
                        <Button variant="outline-primary"
                            className="ms-1 fw-bold">sign in</Button>
                    </LinkContainer>}
            </Container>
        </Navbar>
    );
}
