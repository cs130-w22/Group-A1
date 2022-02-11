import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import PropTypes from 'prop-types';
import { UserContext } from '../utils/userContext';
import AvailabilitySection from './AvailabilitySection';
import InviteBox from './InviteBox';
import PollSection from './PollSection';
import { CategoryTitle, SectionTitle } from './styled/headers';

const dummyData = {
  name: 'Mango Party',
  creator: 'MangoMuncher',
  time: null,
  description: 'Really descriptive description goes here!',
  invited: [{ id: '1', username: 'AppleGobbler' }],
  coming: [{ id: '2', username: 'StrawberryEater' }],
  declined: [{ id: '3', username: 'PartyPooper' }],
  id: 'rwcB1Udmdasdfxgge',
};

function UserList({ users }) {
  const listItems = users.map((user) => (
    <li key={user.id}>
      {user.username}
    </li>
  ));
  return <ul className="list-unstyled mb-4">{listItems}</ul>;
}

function EventMembers({ coming, invited, declined }) {
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

function EventPage() {
  const { user } = useContext(UserContext);
  const [data, setData] = useState();
  const [inviteField, setInviteField] = useState('');
  const [loading, setLoading] = useState();
  useEffect(() => {
    setLoading(true);
    setData(dummyData);
    setLoading(false);
  }, [user, data]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteField?.length > 0) { console.log(`Invite ${inviteField}`); }
  };
  const handleChange = (e) => {
    setInviteField(e.target.value);
  };
  return (
    <Container fluid className="px-0 pt-4">
      { loading || !data ? (
        <Watch
          heigth="100"
          width="100"
          color="grey"
          ariaLabel="loading"
        />
      ) : (
        <Row>
          {/* Left Column */}
          <Col xs={8}>
            <span className="text-uppercase text-secondary fw-bold">{ data?.time || 'TIME TBA'}</span>
            <h2 className="fs-3 fw-bold mt-1 mb-1">{data?.name}</h2>
            <span className="text-muted">
              Hosted by
              {' '}
              {data?.creator}
            </span>
            <p className="mt-3">{data?.description}</p>
            <AvailabilitySection />
            <PollSection />
          </Col>
          <Col>
            <InviteBox
              handleInvite={handleInvite}
              inviteField={inviteField}
              handleChange={handleChange}
              eventURL={data?.id || ''}
            />
            <EventMembers
              coming={data?.coming}
              invited={data?.invited}
              declined={data?.declined}
            />
          </Col>
        </Row>
      )}
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

export default EventPage;
