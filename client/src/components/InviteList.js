import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { getUserInvites } from '../api/invite';
import { UserContext } from '../utils/context';

function InviteList() {
  const { user } = useContext(UserContext);
  const [invites, setInvites] = useState([]);
  useEffect(() => {
    getUserInvites(user.userId).then((res) => {
      console.log(res.data.invites);
      setInvites(res.data.invites);
    });
  }, [user]);

  const invitesList = invites.map((invite, i) => (
    <li>
      <p>
        from:
        {' '}
        {invite.sender.username}
      </p>
      <p>
        {' '}
        event:
        {' '}
        {invite.target.name}
      </p>
    </li>
  ));

  return (
    <Container className="mx-0 mt-3">
      <h3>Invite List Placeholder</h3>
      {invites?.length === 0 && <p className="text-muted">No invites here!</p>}
      <ul>{invitesList}</ul>
    </Container>
  );
}
export default InviteList;
