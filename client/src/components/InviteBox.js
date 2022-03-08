import React, { useContext, useEffect, useState } from 'react';
import {
  Container, Form, FormControl, InputGroup,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { SectionTitle } from './styled/headers';
import { sendEventInvite } from '../api/invite';
import { EventContext } from '../utils/context';

/**
 * Returns InviteBox component
 * @param {string} eventURL URL to event that will be used as invite link
 * @param {callback} onInvite callback function that will be called on Invite send
 * @returns {JSX.Element} InviteBox component
 * @constructor
 */
function InviteBox({
  eventURL,
  onInvite,
}) {
  const { eventId, readOnly } = useContext(EventContext);
  const [inviteField, setInviteField] = useState('');
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [invalid, setInvalid] = useState(false);

  const resetMessages = () => {
    setErrorMsg();
    setSuccessMsg();
    setInvalid(false);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    resetMessages();
    if (!inviteField || inviteField.length === 0) {
      setErrorMsg('You must enter a username to invite someone!');
      setInvalid(true);
    } else {
      sendEventInvite(eventId, inviteField)
        .then((res) => {
          setSuccessMsg('Invite sent!');
          onInvite({ username: inviteField, _id: res.recipient });
          setInviteField('');
        }).catch((err) => {
          const validationErrors = err.response.data?.errors;
          if (validationErrors?.length > 0) {
            setErrorMsg(validationErrors[0].msg);
          } else {
            setErrorMsg(err.response.data);
          }
          setInvalid(true);
        });
    }
  };

  useEffect(() => {

  });

  const handleChange = (e) => {
    resetMessages();
    setInviteField(e.target.value);
  };

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
            disabled={readOnly}
            isInvalid={invalid}
          />
          <Form.Control.Feedback className="w-100" type="invalid">
            {errorMsg}
            {' '}
          </Form.Control.Feedback>
          <span className="w-100 text-primary" type="valid">
            {successMsg}
            {' '}
          </span>
        </InputGroup>
      </Form>
      <span className="mt-0 text-muted">
        https://cya-client-cs130.herokuapp.com/event/
        {eventURL}
      </span>
    </Container>
  );
}

InviteBox.propTypes = {
  eventURL: PropTypes.string.isRequired,
  onInvite: PropTypes.func.isRequired,
};

export default InviteBox;
