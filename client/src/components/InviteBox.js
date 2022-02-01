import React from 'react';
import {
  Container, Form, FormControl, InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { SectionTitle } from './styled/headers';

function InviteBox({
  handleInvite, handleChange, inviteField, eventURL,
}) {
  return (
    <Container>
      <SectionTitle>Invite Friends 💌</SectionTitle>
      <p>Invite people by username, or share the link below!</p>
      <Form onSubmit={handleInvite}>
        <InputGroup className="mb-2">
          <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
          <FormControl
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={inviteField}
            onChange={handleChange}
          />
        </InputGroup>
      </Form>
      <span className="mt-0 text-muted">
        localhost:3000/event/
        {eventURL}
      </span>
    </Container>
  );
}

InviteBox.propTypes = {
  handleInvite: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  inviteField: PropTypes.string.isRequired,
  eventURL: PropTypes.string.isRequired,
};

export default InviteBox;
