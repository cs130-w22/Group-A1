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

function EventList(props) {
  //const [createdEvent,setCreatedEvent] =useState(false);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [ownedEvents, setOwnedEvents] = useState([]);
  const [memberedEvents, setMemberedEvents] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [event, setEvent] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState([]);
  const [dataSorted, setDataSorted] = useState([]);
  const [sortItem, setSortItem] = useState('name');
  const [pressed, setPressed] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingData, setEditingData] = useState();

  //gets the name of the event/progile owner
  const ownerName = props.props;
  //getting owned and invited events seperately from api
  useEffect(() => {
    getEventList()
      .then((res) => {
        console.log(res);
        setOwnedEvents(res.data.owned);
        setMemberedEvents(res.data.memberOnly);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching Events, please try again later!');
      });
  }, [user]);

  //handle the dropdown sorting
  const sortArray = (e) => {
    const sorted = [...ownedEvents].sort((a, b) => a[e].localeCompare(b[e]));
    setOwnedEvents(sorted);
  };
  //handles the alphabetical sorting
  const handleSort = (e) => {
    //this is a to z
    if (!pressed) {
      const sorted = [...ownedEvents].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      setOwnedEvents(sorted);
      setPressed(true);
    }
    //this is z to a
    else {
      const sorted = [...ownedEvents].sort((a, b) =>
        b.name.localeCompare(a.name),
      );
      setOwnedEvents(sorted);
      setPressed(false);
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

  const displayEvents = (events, isOwned) => {
    return events.map((event) => (
      <div key={event._id}>
        <Link to={`/event/${event._id}`} style={{ textDecoration: 'none' }} >
          <Card className="border py-2 px-4 mb-3">
            <div className='py-4'>
              <div className=" text-primary px-4">
                <div className="d-flex justify-content-between">
                  <div id="event-header">
                    {event.archived && (
                      <div className="fw-bold text-secondary">Finalized</div>
                    )}
                    <h3 className="fs-4 fw-bold">{event.name}</h3>
                    <span className='text-dark'>
                      hosted by{' '}
                      <span className="fw-bold text-dark ">{event.owner.username}</span>
                    </span>

                  </div>
                  <div id="options">
                    {isOwned && !event.archived && (
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
                <Row className="fw-bold text-secondary px-4 mb-2 mt-3">
                  {event.archived && (<Col className=" fw-bold text-secondary ">When:</Col>)}
                  {event.archived && (<Col className=" fw-bold text-secondary ">What: { }</Col>)}
                </Row>
                <Row className=" px-4 ">
                  <Col><span className="fw-bold text-secondary">Who:</span> <span className="text-dark">
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
                    })} </span></Col>
                  {event.archived && (<Col className=" fw-bold text-secondary ">Where: { }</Col>)}
                </Row>
              </>


            </div>
          </Card>
        </Link>
      </div>
    ));
  };

  return (
    <>
      <div
        variant="outline-primary"
        className="d-flex flex-row-reverse fw-bold"
      >
        <select
          variant="outline-primary"
          onChange={(e) => sortArray(e.target.value)}
        >
          <option>sort by</option>
          <option>my events</option>
          <option>owner</option>
          <option value="createdAt">date</option>
        </select>
        <br></br>
        <Button
          onClick={(e) => handleSort(e.target.value)}
          value="name"
          variant="outline-primary"
          size="sm"
          className="fw-bold text-black mx-3 px-3"
        >
          A-Z
        </Button>
      </div>
      <br></br>
      <div id="all-events">
        <h2 className="h3 fw-bold text-secondary">created events</h2>
        <br />
        {displayEvents(ownedEvents, true)}
        <h2 className="h3 fw-bold text-secondary">my events</h2>
        {displayEvents(memberedEvents, false)}
      </div>
      {editingStatus && (
        <EventEdit
          editing={editingStatus}
          closeEditor={() => closeEventEditor()}
          eventId={editingData._id}
          editName={editingData.name}
          editDescription={editingData.description}
        ></EventEdit>
      )}
    </>
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
