/* eslint-disable array-callback-return */
/* eslint-disable no-const-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import { Card, Row, Col, ListGroup, Button, Alert, Modal, Form} from 'react-bootstrap';
import { joinEvent, getEvent, getEventList } from '../api/event';
import { getUserByUsername } from '../api/users';
import { UserContext } from '../utils/context';
import {Create} from './Create'
import PropTypes from 'prop-types';
import { useHref, useParams } from 'react-router-dom';
import PollList from './PollList';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EventPage from './EventPage';
import { bn } from 'date-fns/locale';


function EventList (props)
{
  //const [createdEvent,setCreatedEvent] =useState(false);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [ownedEvents, setOwnedEvents] = useState([]);
  const [memberedEvents, setMemberedEvents] = useState([]);
  const [eventList, setEventList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [event,setEvent] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState([]);
  const [dataSorted, setDataSorted] = useState([]);
  const [sortItem, setSortItem] = useState('');
  const [pressed,setPressed] = useState(false);
  const [dropped,setDropped] = useState(false);
  
  //gets the name of the event/progile owner
  const ownerName = props.props;
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
  console.log()
  const handleSort=()=>{
    //this is a to z
    if(!pressed)
    {const sorted = [...ownedEvents].sort((a, b) => a.name.localeCompare(b.name))
      setOwnedEvents(sorted)
      setPressed(true)}
    //this is z to a
    else
    {const sorted = [...ownedEvents].sort((a, b) => b.name.localeCompare(a.name))
      setOwnedEvents(sorted)
      setPressed(false);}}
    //for debugging
  //console.log(ownedEvents);
  const displayEvents = (events) => 
  { //displays archived events
    if(sortItem === 'archived')
    {events = ownedEvents.filter((item)=>item.archived === true)}
    //displays non archived events
    if(sortItem === 'notArchived')
    {events = ownedEvents.filter((item)=>item.archived === false)}
    //this part is just to show filtering works
    //can be changed when we have going/notgoing function added
    if(sortItem === 'going')
    {events =  ownedEvents.filter((item)=>item.name.includes("1"));}
    //notgoing
    if(sortItem === 'notGoing')
    {events =  ownedEvents.filter((item)=>item.name.includes("t"));}
    //when none of the option is selected  display all the events
    if(sortItem === '' )
    {events =  [ownedEvents,memberedEvents];}
    //only show the event i created
    if(sortItem === 'owner')
    {events =  ownedEvents;}
    return (events.map((event) => 
        <div key={event._id}>
          <Card className="border py-4 px-4 mb-3">
            <div>
              <div className="fw-bold text-primary px-4 mt-4">
                Event Name <span className="text-black">{ event.name }</span>
                <div className='text-black'>
                  hosted by {" "} 
                  <span className="text-muted px-3"> 
                    {ownerName}
                  </span>
                </div>
              </div>
              <div className='text-muted  px-4'>
                Decription: {event.description}
              </div>
              <br></br>
              <Row className="fw-bold text-secondary px-4 mb-2">
                <Col className=" fw-bold text-secondary ">
                  When: 
                </Col>
                <Col className=" fw-bold text-secondary ">
                  What: {}
                </Col>
              </Row>
              <Row className="fw-bold text-secondary px-4 mb-4">
                <Col className=" fw-bold text-secondary ">
                  Who: 
                </Col>
                <Col className=" fw-bold text-secondary ">
                  Where: {}
                </Col>
              </Row>
            </div>
          </Card>
        </div>
  ))}
  return (
    <>
      <div  variant="outline-primary" className ='d-flex flex-row-reverse fw-bold' >
        <select variant="outline-primary"  onChange={(e) => setSortItem(e.target.value)} > 
          <option value = "" >sort by</option>
          <option value="owner"> created by me </option>
          <option value="going"> going </option>
          <option value="notGoing"> not going </option>
          <option value="archived" > archived </option>
          <option value="notArchived"> not archived </option>
        </select>
        <br></br>
        <Button  
          onClick={()=>handleSort()}
          value="name" 
          variant="outline-primary" 
          size="sm" 
          className="fw-bold text-black mx-3 px-3">A-Z
        </Button>
      </div>
      <br></br>
      <div id="all-events">
        My Events: <br/>
         { displayEvents(ownedEvents)}
        { displayEvents(memberedEvents)}
      </div>
    </>
  );
}
export default EventList;