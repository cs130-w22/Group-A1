import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { ImCheckmark, ImCross } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  acceptEventInvite,
  declineEventInvite,
  getUserInvites,
} from '../api/invite';
import { UserContext } from '../utils/context';

// eslint-disable-next-line no-unused-vars
const InviteButtons = styled.div`
  width: 20%;
`;
// eslint-disable-next-line no-unused-vars
const InviteText = styled.div`
  width: 80%;
`;

function InviteList() {
  const { user, setUser } = useContext(UserContext);
  const [invites, setInvites] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getUserInvites(user.userId).then((res) => {
      setInvites(res.data.invites);
    });
  }, [user]);

  const onAccept = (id) => {
    acceptEventInvite(id)
      .then((res) => {
        console.log(`Accepted ${res.data.event}`);
        setInvites(invites.filter((invite) => invite._id !== id));
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setUser(null);
          navigate('/login');
        } else {
          console.log(err);
        }
      });
  };

  const onDecline = (id) => {
    declineEventInvite(id)
      .then(() => {
        setInvites(invites.filter((invite) => invite._id !== id));
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setUser(null);
          navigate('/login');
        } else {
          console.log(err);
        }
      });
  };

  const invitesList = invites.map((invite) => (
    <Card className="mx-0 shadow-sm border-primary" key={invite._id}>
      <Card.Body className="p-3 px-4">
        <div className="d-flex">
          <InviteText className="me-2">
            <span className="text-primary fw-bold">
              {invite.sender.username}
            </span>{' '}
            invited you to
            <span className="fw-bold"> {invite.target.name}</span>
          </InviteText>
          <InviteButtons className="ms-2">
            {' '}
            <div className="mt-1 d-flex ">
              <Button
                variant="outline-success"
                className="fw-bold me-2 btn-sm rounded-circle invite-button"
                aria-label="accept"
                onClick={() => onAccept(invite._id)}
              >
                <ImCheckmark className="mt-n1" />
              </Button>
              <Button
                variant="outline-secondary"
                className="fw-bold btn-sm rounded-circle invite-button"
                aria-label="decline"
                onClick={() => onDecline(invite._id)}
              >
                <ImCross className="mt-n1" />
              </Button>
            </div>
          </InviteButtons>
        </div>
      </Card.Body>
    </Card>
  ));

  return (
    <Container className="mx-0 mt-2">
      <h3 className="text-secondary fw-bold">your invites</h3>
      {invites?.length === 0 && <p className="text-muted">No invites yet!</p>}
      <div>{invitesList}</div>
    </Container>
  );
}
export default InviteList;
