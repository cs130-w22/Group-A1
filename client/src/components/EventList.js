/* eslint-disable array-callback-return */
/* eslint-disable no-const-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  Row,
  Col,
  ListGroup,
  Button,
  Alert,
  Modal,
  Form,
  ToggleButton,
  FormSelect,
} from 'react-bootstrap';
import { joinEvent, getEvent, getEventList } from '../api/event';
import { getUser } from '../api/users';
import { UserContext } from '../utils/context';
import { Create } from './Create';
import EventEdit from './EventEdit';
import PropTypes from 'prop-types';
import { useHref, useParams } from 'react-router-dom';
import PollList from './PollList';
import { NavLink, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EventPage from './EventPage';
import { bn } from 'date-fns/locale';
import { LinkContainer } from 'react-router-bootstrap';
import { format, parseISO } from 'date-fns';

function EventList(props) {
  //const [createdEvent,setCreatedEvent] =useState(false);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingData, setEditingData] = useState();
  const [filterArchived, setFilterArchived] = useState(false);
  const [filterUnarchived, setFilterUnarchived] = useState(false);
  const [filterOwned, setFilterOwned] = useState(false);
  const [filterJoined, setFilterJoined] = useState(false);

  //gets the name of the event/progile owner
  const ownerName = props.props;
  //getting owned and invited events seperately from api
  useEffect(() => {
    getEventList()
      .then((res) => {
        console.log(res);
        setEvents(res.data.events);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching Events, please try again later!');
      });
  }, [user]);

  //handle the dropdown sorting
  const sortArray = (e) => {
    if (e === 'owner') {
      let s = [...events].sort((a, b) => a.owner.username.localeCompare(b.owner.username))
      console.log(s);
      setEvents(s);
    } else if (e === 'unsorted') {
      setEvents([...events].sort((a, b) => a._id.localeCompare(b._id)));
    } else {
      const sorted = [...events].sort((a, b) => a[e].localeCompare(b[e]));
      setEvents(sorted);
    }
  };

  //console.log(ownedEvents,[ownedEvents]);

  /*
  const openEventEditor = (e, event) => {
    setEditingData(event);
    setEditingStatus(true);
  };
  */


  const closeEventEditor = () => {
    setEditingStatus(false);
    setEditingData(undefined);
  };

  const MAXUSERS = 3;

  useEffect(() => {
    if (editingData !== undefined) {
      setEditingStatus(() => true);
      console.log(editingData);
    }
  }, [editingData]);

  const filterArray = (e) => {
    setFilterUnarchived(false);
    setFilterOwned(false);
    setFilterJoined(false);
    setFilterArchived(false);
    switch (e) {
      case 'archived':
        setFilterArchived(true);
        break;
      case 'unarchived':
        setFilterUnarchived(true);
        break;
      case 'created':
        setFilterOwned(true);
        break;
      case 'joined':
        setFilterJoined(true);
        break;
      default:
        break;
    }
  }

  const displayEvents = (events) => {
    return events.map((event) => {
      if (filterArchived === true && !event.archived) return null;
      if (filterUnarchived === true && event.archived) return null;
      return (
        <div key={event._id}>
          <Link to={`/event/${event._id}`} style={{ textDecoration: 'none' }} >
            <Card className="border py-2 px-4 mb-3">
              <div className='py-4'>
                <div className=" px-4">
                  <div className="d-flex justify-content-between">
                    <div id="event-header">
                      {event.archived && (
                        <div className="fw-bold text-secondary">Archived</div>
                      )}
                      <h3 className="fs-4 fw-bold">{event.name}</h3>
                      <span className='text-dark'>
                        hosted by{' '}
                        <span className="fw-bold text-dark ">{event.owner.username}</span>
                      </span>

                    </div>
                    <div id="options">
                      {event.owner._id === user.userId && !event.archived && (
                        <Button
                          variant="btn btn-outline-primary  fw-bold"
                          onClick={() => setEditingData(event)}
                        >
                          edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-muted mt-1 px-4 mb-2">
                  {event.description}
                </div>

                <>
                  <Row className="px-4 mb-2 mt-3">
                    {event.finalized && (
                      <Col>
                        <span className=" fw-bold text-secondary">When: </span>
                        <span className="text-dark">
                          {format(parseISO(event.finalTime), "H:mm aaa 'at' MM/dd/yyyy")}
                        </span>
                      </Col>
                    )}
                    {event.finalized && (<Col className=" fw-bold text-secondary ">What: <span className="text-dark"></span></Col>)}
                  </Row>
                  <Row className=" px-4 ">
                    <Col>
                      <span className="fw-bold text-secondary">Who:</span> <span className="text-dark">
                        {event.members.map((member, i) => {
                          if (i !== event.members.length - 1 && i < MAXUSERS) return (
                            <span>{member.username}, </span>
                          )
                          else if (i < MAXUSERS && i === event.members.length - 1) return (
                            <span> {member.username} </span>
                          )
                          else if (i === MAXUSERS) return (
                            <span> and {event.members.length - MAXUSERS} other(s) </span>
                          )
                          else return;
                        })}
                      </span>
                    </Col>
                    {event.finalized && (<Col className=" fw-bold text-secondary ">Where: { }</Col>)}
                  </Row>
                </>


              </div>
            </Card>
          </Link>
        </div>
      )
    });
  };

  return (
    <div>

      <br></br>
      <div id="all-events">
        <h2 className="h2 fw-bold text-secondary">my events</h2>
        <div className='d-flex justify-content-between mb-4'>
          <LinkContainer to="/event/create">
            <Button variant="outline-primary" className="ms-1 fw-bold">
              create event +
            </Button>
          </LinkContainer>
          <div
            className="d-flex flex-row-reverse "
          >
            <FormSelect
              className='ms-2'
              onChange={(e) => filterArray(e.target.value)}
            >
              <option>filter by</option>
              <option>created</option>
              <option>joined</option>
              <option>archived</option>
              <option>unarchived</option>
            </FormSelect>
            <FormSelect
              className='ms-2'
              onChange={(e) => sortArray(e.target.value)}
            >
              <option value='unsorted'>sort by</option>
              <option>name</option>
              <option>owner</option>
              <option value="createdAt">date</option>
            </FormSelect>

          </div>
        </div>
        {!filterJoined && !filterOwned && displayEvents(events)}
        {filterJoined && displayEvents(events.filter((event) => event.owner._id !== user.userId))}
        {filterOwned && displayEvents(events.filter((event) => event.owner._id === user.userId))}
      </div>
      {
        editingStatus && (
          <EventEdit
            editing={editingStatus}
            closeEditor={() => closeEventEditor()}
            eventId={editingData._id}
            editName={editingData.name}
            editDescription={editingData.description}
          ></EventEdit>
        )
      }
    </div >
  );
}

/*
EventMembers.propTypes = {
  coming: PropTypes.arrayOf(PropTypes.object).isRequired,
  invited: PropTypes.arrayOf(PropTypes.object).isRequired,
  declined: PropTypes.arrayOf(PropTypes.object).isRequired,
};
UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
*/
export default EventList;
