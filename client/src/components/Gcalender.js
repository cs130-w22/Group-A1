//reference: https://dev.to/nouran96/google-calendar-events-with-react-544g
import { joinEvent, getEvent, getEventList } from '../api/event';
import React, { useState, useEffect, useContext } from 'react';
import { getUser } from '../api/users';
import { UserContext, EventContext } from '../utils/context';
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

function Gcalender({
  showCalender,
  eventId,
  editName,
  editDescription,
  wholeEvent,
  eventTime,
}) {
  const { user } = useContext(UserContext);
  const [ownedEvents, setOwnedEvents] = useState([]);
  const [memberedEvents, setMemberedEvents] = useState([]);
  const [eventList, setEventList] = useState([]);
  //const { readOnly } = useContext(EventContext);
  const savedEvent = localStorage.getItem('event_data');
  const eventdata = JSON.parse(savedEvent);
  const [isMember, setIsMember] = useState(false);

  var CLIENT_ID =
    '271241013760-q6dhrc67dh68h322jgp6736uv1jll2qs.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyBOB_QJ5v_g5jxNiR8PEo9TEBEtSo5hL5o';
  var DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ];
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

  //create script for gapi
  useEffect(() => {
    const doc = document.createElement('script');
    doc.async = true;
    doc.defer = true;
    doc.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(doc);
    doc.addEventListener('load', () => {
      if (window.gapi) {
        handleClientLoad();
      }
    });
  }, [eventId]);

  //load the gapi
  const handleClientLoad = () => {
    window.gapi.load('client:auth2', handleResult);
  };
  //after gapi loaded check user info
  const handleResult = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      });
      window.gapi.client.load('calendar', 'v3', () =>
        console.log('we have the gapi result'),
      );
      window.gapi.auth2.getAuthInstance().signIn().then(eventDetails);
    });
    //console.log("we got the gapi")
  };
  /*const attendPeople = () => {
    return (
      <ul>
        {eventdata.invitees.map((person) => {
          return <li>email:{person.email}</li>;
        })}
      </ul>
    );
  };*/
  const eventDetails = () => {
    var event = {
      summary: editName,
      location: '',
      description: editDescription,
      start: {
        dateTime: eventTime[0],
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: eventTime[1],
        timeZone: 'America/Los_Angeles',
      },
      //attendees: attendPeople,
    };

    var request = window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    request.execute((event) => {
      //console.log(event)
      window.open(event.htmlLink); //open the calender
    });
  };
  //get events from calender
  //console.log('this is the event ', attendPeople());
  return <div className="App"></div>;
}
export default Gcalender;
