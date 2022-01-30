import { Navbar, Container } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import logo from '../assets/cya.svg';

const LoginHeader= (
    <Navbar expand="lg" className="mt-3">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand href="/">
            <img src={logo} width="100" height="40" 
            className="d-inline-block align-top" alt="👋 cya" />
          </Navbar.Brand>
        </LinkContainer>
      </Container>
    </Navbar>
)

export default LoginHeader;