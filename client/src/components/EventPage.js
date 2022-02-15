import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import {
  Col, Container, Row, Alert, Button,
} from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { UserContext, EventContext } from '../utils/context';
import AvailabilitySection from './AvailabilitySection';
import InviteBox from './InviteBox';
import PollSection from './PollSection';
import { getEvent } from '../api/event';
import { EventMembers, UserList } from './UserList';

const dummyData = {
  name: 'Mango Party',
  creator: 'MangoMuncher',
  time: null,
  description: 'Really descriptive description goes here!',
  invited: [{ id: '1', username: 'AppleGobbler' }],
  coming: [{ id: '2', username: 'StrawberryEater' }],
  declined: [{ id: '3', username: 'PartyPooper' }],
};

function EventPage() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [data, setData] = useState();
  const [inviteField, setInviteField] = useState('');
  const [loading, setLoading] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [isMember, setIsMember] = useState(false);

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
        setIsMember(eventData.members.some((member) => member._id === user.userId));
      })
      .catch((err) => {
        setErrorMsg('Sorry! Something went wrong.');
      }).finally(() => setLoading(false));
  }, [id, user]);

  // useEffect(() => console.log(data), [data]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (inviteField?.length > 0) { console.log(`Invite ${inviteField}`); }
  };
  const handleChange = (e) => {
    setInviteField(e.target.value);
  };

  const joinEvent = () => {
    console.log('Placeholder for joining event');
  };

  const contextProvider = useMemo(
    () => ({ readOnly: !isMember, eventId: id }),
    [isMember, id],
  );

  return (
    <Container fluid className="px-0 pt-4">
      {!isMember
        && (
          <Alert className="d-flex justify-content-between">
            You are not a part of this group yet!
            You can take a look around, or join the event to start planning!
            <Button variant="outline-primary fw-bold btn-sm" onClick={joinEvent}>Join Event</Button>
          </Alert>
        )}
      {loading && (
        <Watch
          heigth="100"
          width="100"
          color="grey"
          ariaLabel="loading"
        />
      )}
      {!loading && data ? (
        <EventContext.Provider value={contextProvider}>
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
              <AvailabilitySection />
              <PollSection />
              <hr className="mt-4" />
              <p className="mt-3 fs-6 text-muted">
                Created on
                {' '}
                {format(parseISO(data?.createdAt), 'MM/dd/yyyy')}
              </p>
            </Col>
            <Col>
              {isMember && (
                <InviteBox
                  handleInvite={handleInvite}
                  inviteField={inviteField}
                  handleChange={handleChange}
                  eventURL={id || ''}
                />
              )}
              <EventMembers
                coming={data?.coming}
                invited={data?.invited}
                declined={data?.declined}
              />
            </Col>
          </Row>
        </EventContext.Provider>
      ) : (
        <>
          {' '}
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        </>
      )}
    </Container>
  );
}

export default EventPage;
