import React, { useContext, useEffect, useState } from 'react';
import {Col, Container, Row, Alert} from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { UserContext } from '../utils/userContext';
import AvailabilitySection from './AvailabilitySection';
import InviteBox from './InviteBox';
import PollSection from './PollSection';
import { CategoryTitle, SectionTitle } from './styled/headers';
import { getEvent } from '../api/event';

const dummyData = {
  name: 'Mango Party',
  creator: 'MangoMuncher',
  time: null,
  description: 'Really descriptive description goes here!',
  invited: [{ id: '1', username: 'AppleGobbler' }],
  coming: [{ id: '2', username: 'StrawberryEater' }],
  declined: [{ id: '3', username: 'PartyPooper' }],
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
  const { id } = useParams();
  const [data, setData] = useState();
  const [inviteField, setInviteField] = useState('');
  const [loading, setLoading] = useState();
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    setLoading(true);
    getEvent(id)
      .then((res) => {
        const eventData = res.data;
        setData({
          ...eventData,
          invited: [{ id: '1', username: 'AppleGobbler' }],
          coming: [{ id: '2', username: 'StrawberryEater' }],
          declined: [{ id: '3', username: 'PartyPooper' }],
        });
      })
      .catch((err) => {
        setErrorMsg('Sorry! Something went wrong.');
      }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => console.log(data), [data]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteField?.length > 0) { console.log(`Invite ${inviteField}`); }
  };
  const handleChange = (e) => {
    setInviteField(e.target.value);
  };
   //this is probably is temp way to retrieve the data for list of events
   const createString = JSON.stringify(data);
   localStorage.setItem("user",createString);


  return (
    <Container fluid className="px-0 pt-4">

      {loading && (
        <Watch
          heigth="100"
          width="100"
          color="grey"
          ariaLabel="loading"
        />
      )}
      {!loading && data ? (
        <Row>
          {/* Left Column */}
          <Col xs={8}>
            <span className="text-uppercase text-secondary fw-bold">{data?.time || 'TIME TBA'}</span>
            <h2 className="fs-3 fw-bold mt-1 mb-1">{data?.name}</h2>
            <span className="text-muted">
              Hosted by
              {' '}
              {data?.owner?.username}
            </span>
            <p className="mt-3">{data?.description}</p>
            <AvailabilitySection eventId={id} />
            <PollSection eventId={id} />
            <hr className="mt-4" />
            <p className="mt-3 fs-6 text-muted">
              Created on
              {' '}
              {format(parseISO(data?.createdAt), 'MM/dd/yyyy')}
            </p>
          </Col>
          <Col>
            <InviteBox
              handleInvite={handleInvite}
              inviteField={inviteField}
              handleChange={handleChange}
              eventURL={id || ''}
            />
            <EventMembers
              coming={data?.coming}
              invited={data?.invited}
              declined={data?.declined}
            />
          </Col>
        </Row>
      ) : (
        <>
          {' '}
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        </>
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
