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
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EventPage from './EventPage';
import { bn } from 'date-fns/locale';
import Gcalender from './Gcalender';
import { propTypes } from 'react-bootstrap/esm/Image';

function EventList(thisprops) {
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
  const [GcalActivate, setGcalActivate] = useState(false);
  const [calenderInfo, setCalenderInfo] = useState();

  //gets event information about going or not
  const saved = localStorage.getItem('going');
  const isGoing = JSON.parse(saved);

  const savedEvent = localStorage.getItem('event_data');
  const eventdata = JSON.parse(savedEvent);

  //gets the name of the event/progile owner
  const ownerName = thisprops.props;
  //getting owned and invited events seperately from api
  useEffect(() => {
    getEventList()
      .then((res) => {
        setOwnedEvents(res.data.owned);
        setMemberedEvents(res.data.memberOnly);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching Events, please try again later!');
      });
  }, [user]);

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

  const closeEventEditor = () => {
    setEditingStatus(false);
    setEditingData(undefined);
  };

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

  const displayEvents = (events, isOwned) => {
    //let props ={event:events, GcalActivate:GcalActivate}
    //displays archived events
    if (sortItem === 'archived') {
      events = events.filter((item) => item.archived === true);
    }
    //displays non archived events
    if (sortItem === 'notArchived') {
      events = events.filter((item) => item.archived === false);
    }
    //this part is just to show filtering works
    //can be changed when we have going/notgoing function added
    if (sortItem === 'going') {
      events = events.filter((item) => item.isGoing);
    }
    //notgoing
    if (sortItem === 'notGoing') {
      events = events.filter((item) => !item.isGoing);
    }
    //when none of the option is selected  display all the events
    if (sortItem === '') {
      events = [events, memberedEvents];
    }
    //only show the event i created
    if (sortItem === 'owner') {
      events = ownedEvents;
    }
    return events.map((event) => (
      <div key={event._id}>
        <Card className="border py-4 px-4 mb-3">
          <div>
            <div className="fw-bold text-primary px-4 mt-4">
              Event Name <span className="text-black">{event.name}</span>
              <div className="text-black">
                hosted by <span className="text-muted px-3">{ownerName}</span>
              </div>
            </div>
            <div className="text-muted  px-4">
              Decription: {event.description}
            </div>
            <br></br>
            <Row className="fw-bold text-secondary px-4 mb-2">
              <Col className=" fw-bold text-secondary ">When:</Col>
              <Col className=" fw-bold text-secondary ">What: {}</Col>
            </Row>
            <Row className="fw-bold text-secondary px-4 mb-4">
              <Col className=" fw-bold text-secondary ">
                Who:{eventdata.coming}
              </Col>
              <Col className=" fw-bold text-secondary ">Where: {}</Col>
            </Row>
            <hr className="bg-secondary" />
            <Row>
              <Col>
                {' '}
                {isOwned && (
                  <Button
                    varient="btn btn-outline-secondary"
                    onClick={() => setEditingData(event)}
                  >
                    edit
                  </Button>
                )}
              </Col>
              <Col className="col-4">
                <Button
                  varient="btn btn-outline-secondary"
                  onClick={() => handleGcalender(event)}
                >
                  add to Google
                </Button>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    ));
  };

  return (
    <>
      <br></br>
      <div id="all-events">
        <h2 className="h3 fw-bold text-secondary mt-3">created events</h2>
        <div
          variant="outline-primary"
          className="d-flex flex-row-reverse fw-bold ml-auto"
        >
          <select
            variant="outline-primary"
            onChange={(e) => setSortItem(e.target.value)}
          >
            <option value="">sort by</option>
            <option value="owner"> created by me </option>
            <option value="going"> going </option>
            <option value="notGoing"> not going </option>
            <option value="archived"> archived </option>
            <option value="notArchived"> not archived </option>
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
      {GcalActivate && (
        <Gcalender
          showCalender={GcalActivate}
          eventId={calenderInfo._id}
          editName={calenderInfo.name}
          editDescription={calenderInfo.description}
          wholeEvent={calenderInfo}
          eventTime={calenderInfo.dates}
        ></Gcalender>
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