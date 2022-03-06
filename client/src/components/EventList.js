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
  FormSelect,
} from 'react-bootstrap';
import { getEventList } from '../api/event';
import { getUser } from '../api/users';
import { UserContext, EventContext } from '../utils/context';
import { Create } from './Create';
import EventEdit from './EventEdit';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Gcalender from './Gcalender';
import { LinkContainer } from 'react-router-bootstrap';
import { format, parseISO } from 'date-fns';

function EventList(thisprops) {
  const [events, setEvents] = useState([]);
  const [errorMsg, setErrorMsg] = useState();
  const [filter, setFilter] = useState('name');
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingData, setEditingData] = useState();
  const [GcalActivate, setGcalActivate] = useState(false);
  const [sort, setSort] = useState("A-Z");
  const [calenderInfo, setCalenderInfo] = useState();
  const { user, setUser } = useContext(UserContext);
  //gets event information about going or not

  const savedEvent = localStorage.getItem('event_data');
  const eventdata = JSON.parse(savedEvent);

  //gets the name of the event/progile owner
  const ownerName = thisprops.props;
  //getting owned and invited events seperately from api
  useEffect(() => {
    getEventList()
      .then((res) => {
        setEvents(res.data.events);
        //setMemberedEvents(res.data.memberOnly);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching Events, please try again later!');
      });
  }, [user]);


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

  const handleGcalender = (e) => {
    setGcalActivate(true);
    setCalenderInfo(e);
  };

  useEffect(() => {
    if (calenderInfo !== undefined) {
      setGcalActivate(() => true);
      console.log('this is the calenderinfo ', calenderInfo);
    }
  }, [calenderInfo]);

  const displayEvents = (events) => {

    //let props ={event:events, GcalActivate:GcalActivate}
    //displays archived events
    if (filter === 'archived') {
      events = events.filter((item) => item.archived);
    }
    //displays non archived events
    else if (filter === 'unarchived') {
      events = events.filter((item) => !item.archived);
    }
    //this part is just to show filtering works
    //can be changed when we have going/notgoing function added
    else if (filter === 'going') {
      events = events.filter((item) => item.isGoing);
    }
    //notgoing
    else if (filter === 'notGoing') {
      events = events.filter((item) => !item.isGoing);
    }
    //when none of the option is selected  display all the events
    //only show the event i created
    else if (filter === 'owner') {
      events = events.filter((item) => item.owner._id === user.userId);
    }
    else if (filter === 'joined') {
      events = events.filter((item) => item.owner._id !== user.userId);
    }
    if (sort === 'A-Z') {
      events = events.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'Z-A') {
      events = events.sort((a, b) => b.name.localeCompare(a.name));
    }
    else if (sort === 'creation') {
      events = events.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    else if (sort === 'creationDesc') {
      events = events.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    else {
      events = events.sort((a, b) => a._id.localeCompare(b._id));
    }
    return events.map((event, i) => (
      <div key={event._id}>
        <Card className="border py-2 px-4 mb-3">
          <div className='py-4'>
            <div className=" px-4">
              <div className="d-flex justify-content-between">
                <div id="event-header">
                  {event.archived && (
                    <div className="fw-bold text-secondary">Archived</div>
                  )}
                  <h3 className="fs-4 fw-bold">
                    <a id="event-list-names" href={`/event/${event._id}`}
                      style={{ textDecoration: 'none' }}>
                      {event.name}
                    </a>
                  </h3>
                  <span className='text-dark'>
                    hosted by{' '}
                    <span className="fw-bold text-dark ">{event.owner.username}</span>
                  </span>

                </div>
                <div id="options">
                  <Col>
                    <Row>
                      {event.owner._id === user.userId && !event.archived && (
                        <Button
                          variant="btn btn-outline-primary  fw-bold"
                          onClick={() => setEditingData(event)}
                        >
                          edit
                        </Button>
                      )}
                    </Row>
                    <Row>
                      {(event.members.username === user.username
                        && event.finalized
                      ) ?
                        (<Button
                          varient="btn btn-outline-secondary"
                          onClick={() => handleGcalender(event)}
                        >
                          add to Google
                        </Button>) : ('')}
                    </Row>
                  </Col>
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
      </div>


    ));

  };

  return (
    <>
      <div id="all-events">
        <h2 className="h2 fw-bold text-secondary">my events</h2>
        <div className='d-flex justify-content-between mb-4'>
          <LinkContainer to="/event/create">
            <Button variant="outline-primary" className="ms-1 fw-bold">
              create event +
            </Button>
          </LinkContainer>

          <div
            variant="outline-primary"
            className="d-flex flex-row-reverse"
          >
            <FormSelect
              className='ms-2'
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>filter by</option>
              <option value="owner">created</option>
              <option>joined</option>
              <option>archived</option>
              <option>unarchived</option>
              <option>going</option>
              <option value="notGoing">not going</option>
            </FormSelect>
            <FormSelect
              variant="outline-primary"
              style={{ width: '200px' }}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="sortby">sort by</option>
              <option value="A-Z"> A-Z </option>
              <option value="Z-A"> Z-A </option>

              <option value="creation"> Creation Date (asc)</option>
              <option value="creationDesc"> Creation Date (desc)</option>
            </FormSelect>

          </div>
        </div>
        <br className="" />
        <div className="text-secondary">
          {displayEvents(events)}
        </div>

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
      {
        GcalActivate && (
          <Gcalender
            showCalender={GcalActivate}
            eventId={calenderInfo._id}
            editName={calenderInfo.name}
            editDescription={calenderInfo.description}
            wholeEvent={calenderInfo}
            eventTime={calenderInfo.dates}
          ></Gcalender>
        )
      }
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
