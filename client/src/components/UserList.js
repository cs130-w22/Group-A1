import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { CategoryTitle, SectionTitle } from './styled/headers';

export function UserList({ users }) {
  const listItems = users.map((user) => (
    <li key={user.id}>
      {user.username}
    </li>
  ));
  return <ul className="list-unstyled mb-4">{listItems}</ul>;
}
export function EventMembers({ coming, invited, declined }) {
  return (
    <Container className="mt-4">
      <SectionTitle className="mb-3">Who&apos;s Coming?</SectionTitle>
      <Row>
        <Col>
          <CategoryTitle count={coming.length}>Coming</CategoryTitle>
          <UserList users={coming} />
        </Col>
        <Col>
          <CategoryTitle count={invited.length}>Invited</CategoryTitle>
          <UserList users={invited} />
        </Col>
      </Row>
      <CategoryTitle count={declined.length}>Not Coming</CategoryTitle>
      <UserList users={declined} />
    </Container>
  );
}
EventMembers.propTypes = {
  coming: PropTypes.arrayOf(PropTypes.object).isRequired,
  invited: PropTypes.arrayOf(PropTypes.object).isRequired,
  declined: PropTypes.arrayOf(PropTypes.object).isRequired,
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
