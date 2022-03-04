/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Col, Container, Row, Alert, Button, Modal } from 'react-bootstrap';
import { Watch } from 'react-loader-spinner';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { UserContext, EventContext } from '../utils/context';
import AvailabilitySection from './AvailabilitySection';
import InviteBox from './InviteBox';
import PollSection from './PollSection';
import {
  getEvent,
  joinEvent,
  leaveEvent,
  archiveEvent,
  unarchiveEvent,
} from '../api/event';
import { EventMembers } from './UserList';
import { getEventInvites } from '../api/invite';
import { TITLE } from '../assets/constants';

function EventPage() {
  const { user, setUser } = useContext(UserContext);
  const { id } = useParams();
  const [data, setData] = useState();
  const [members, setMembers] = useState();
  const [archived, setArchived] = useState();
  const [loading, setLoading] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [invited, setInvited] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getEvent(id)
      .then((res) => {
        const eventData = res.data;
        document.title = `${TITLE} - ${eventData.name}`;
        console.log(eventData);
        setData({
          ...eventData,
          coming: [{ id: '2', username: 'StrawberryEater' }],
          declined: [{ id: '3', username: 'PartyPooper' }],
        });
        //var allData =[].concat(eventData);
        localStorage.setItem('event_id', JSON.stringify(id));
        localStorage.setItem('event_data', JSON.stringify(eventData));
        setIsMember(
          eventData.members.some((member) => member._id === user.userId),
        );
        setMembers(eventData.members);
        setIsOwner(eventData.owner._id === user.userId);
        setArchived(eventData.archived);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setUser(null);
          navigate('/login');
        } else {
          console.log(err);
          navigate('/404');
        }
      })
      .finally(() => setLoading(false));
  }, [id, user, setUser, navigate]);

  useEffect(() => {
    getEventInvites(id)
      .then((res) => {
        const invitedUsers = [];
        const invites = res.data;
        for (let i = 0; i < invites.length; i += 1) {
          invitedUsers.push(invites[i].recipient);
        }
        setInvited(invitedUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  // useEffect(() => console.log(data), [data]);

  const handleJoin = () => {
    joinEvent(id)
      .then(() => {
        setIsMember(true);
        const updatedInvites = invited.filter(
          (invite) => invite._id !== user.userId,
        );
        setInvited(updatedInvites);
        setMembers([...members, { _id: user.userId, username: user.username }]);
      })
      .catch((err) => {
        setErrorMsg(err.response.data);
      });
  };

  const contextProvider = useMemo(
    () => ({ readOnly: !isMember || archived, eventId: id, archived: archived}),
    [isMember, archived, id, data],
  );

  const onInvite = (invite) => {
    setInvited([...invited, invite]);
  };

  const promptLeave = () => {
    setShowModal(true);
  };

  const onLeave = () => {
    leaveEvent(id)
      .then(() => {
        navigate('/');
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

  const onArchive = () => {
    archiveEvent(id)
      .then(() => {
        setArchived(true);
        navigate(`/event/${id}`);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setUser(null);
          // navigate('/login');
        } else {
          console.log(err);
        }
      });
  };

  const onUnarchive = () => {
    unarchiveEvent(id)
      .then(() => {
        setArchived(false);
        navigate(`/event/${id}`);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          setUser(null);
          // navigate('/login');
        } else {
          console.log(err);
        }
      });
  };

  return (
    <Container fluid className="px-0 pt-4">
      {loading && (
        <Watch heigth="100" width="100" color="grey" ariaLabel="loading" />
      )}
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {!loading && data && (
        <EventContext.Provider value={contextProvider}>
          {/* banner for signed in non-members */}

          <Modal show={showModal}>
            <Modal.Header>
              <Modal.Title>Leave Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Are you sure you want to leave this group?</p>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="outline-primary"
                className="fw-bold "
                onClick={() => setShowModal(false)}
              >
                stay
              </Button>
              <Button
                variant="secondary"
                className="text-white fw-bold "
                onClick={onLeave}
              >
                leave
              </Button>
            </Modal.Footer>
          </Modal>

          {!isMember && !errorMsg && (
            <Alert className="d-flex justify-content-between">
              You are not a part of this group yet! You can take a look around,
              or join the event to start planning!
              <Button
                variant="outline-primary fw-bold btn-sm"
                onClick={handleJoin}
              >
                Join Event
              </Button>
            </Alert>
          )}
          <Row>
            {/* Left Column */}
            <Col xs={8}>
              <span className="text-uppercase text-secondary fw-bold">
                {data?.time || 'TIME TBA'} {archived && '(finalized)'}
              </span>
              <h2 className="fs-3 fw-bold mt-1 mb-1">{data?.name}</h2>
              <span className="text-muted">
                Hosted by
                {' '}
                {data?.owner?.username}
              </span>
              <p className="mt-3">{data?.description}</p>
              <AvailabilitySection
                members={members}
                timeEarliest={data?.timeEarliest}
                timeLatest={data?.timeLatest}
              />
              <PollSection />
              <hr className="mt-4" />
              <p className="mt-3 fs-6 text-muted">
                Created on
                {' '}
                {data?.createdAt
                  && format(parseISO(data?.createdAt), 'MM/dd/yyyy')}
              </p>
            </Col>
            <Col>
              {isMember && (
                <InviteBox eventURL={id || ''} onInvite={onInvite} />
              )}
              <EventMembers
                coming={data?.coming}
                members={members}
                invited={invited}
                declined={data?.declined}
              />
              {isMember && isOwner && (
                <div className="d-grid gap-2 mx-4">
                  <Button
                    variant="primary"
                    className="fw-bold text-white"
                    onClick={archived ? onUnarchive : onArchive}
                  >
                    {archived ? 'un' : ''}archive event
                  </Button>
                </div>
              )}
              <hr></hr>
              {isMember && (
                <div className="d-grid gap-2 mx-4">
                  <Button
                    variant="secondary"
                    className="fw-bold text-white"
                    onClick={promptLeave}
                  >
                    leave event
                  </Button>
                </div>
              )}
            </Col>
          </Row>
        </EventContext.Provider>
      )}
    </Container>
  );
}

export default EventPage;
