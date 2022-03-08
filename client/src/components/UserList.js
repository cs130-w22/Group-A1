import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { CategoryTitle, SectionTitle } from './styled/headers';

/**
 * Component containing generic list of usernames
 * @param {User[]} users list of Users to include in formatted list
 * @return {JSX.Element}
 * @constructor
 */
 function UserList({ users }) {
  const listItems = users.map((user) => (
    <li key={user._id || 'x'}>{user.username}</li>
  ));
  return <ul className="list-unstyled mb-4">{listItems}</ul>;
}

/**
 * Component containing event members sorted by Event invite response
 * @param {User[]} coming list of Users marked as "Coming"
 * @param {User[]} invited list of Users marked as "Invited"
 * @param {User[]} declined list of Users marked as "Declined"
 * @param {User[]} members list of Users marked as "Members"
 * @return {JSX.Element}
 * @constructor
 */
export function EventMembers({ coming, invited, declined, members }) {
  return (
    <Container className="mt-4">
      <SectionTitle className="mb-3">Who&apos;s Coming?</SectionTitle>
      <Row>
        {coming.length > 0 && (<Col xs={6}>
          <CategoryTitle count={coming.length}>Coming</CategoryTitle>
          <UserList users={coming} />
        </Col>)}
        <Col xs={6}>
          <CategoryTitle count={members.length}>Members</CategoryTitle>
          <UserList users={members} />
        </Col>
        <Col xs={6}>
          <CategoryTitle count={invited.length}>Invited</CategoryTitle>
          <UserList users={invited} />
        </Col>
        {declined.length > 0 && (<Col xs={6}>
          <CategoryTitle count={declined.length}>Not Coming</CategoryTitle>
          <UserList users={declined} />
        </Col>)}
      </Row>
    </Container>
  );
}

EventMembers.propTypes = {
  coming: PropTypes.arrayOf(PropTypes.object).isRequired,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  invited: PropTypes.arrayOf(PropTypes.object).isRequired,
  declined: PropTypes.arrayOf(PropTypes.object).isRequired,
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
