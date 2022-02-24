import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function NotFound() {
  return (
    <Container className="text-center h-100 justify-content-center d-flex flex-col">
      <div>
        <h2 className="fw-bold text-danger display-1 mt-5">404</h2>
        <p className="fs-4">sorry, nothing to see here!</p>
        <LinkContainer to="/">
          <Button variant="outline-primary" className="btn-lg fw-bold">
            go home
          </Button>
        </LinkContainer>
      </div>
    </Container>
  );
}

export default NotFound;
