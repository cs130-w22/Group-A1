/* eslint-disable no-const-assign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, ListGroup, Button, Alert, Modal, Form} from 'react-bootstrap';
import { joinEvent, getEvent } from '../api/event';
import { getUserByUsername } from '../api/users';
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
  const [eventList, setEventList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [event,setEvent] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState([]);
  //get get the event id as local storage
  let getId = localStorage.getItem("event_id");
  getId = JSON.parse(getId);
  //this indicated that we created an event
  //let getbool = localStorage.getItem("created");
  //getbool = JSON.parse(getbool);
  const ownerName = props.props;
 //this suppose to work to get list of events
 useEffect(() => {
  setLoading(true);
  getEvent(getId)
    .then((res) => {
      const resEvent = res.data;
      setEventList([...eventList, resEvent]);
    })
    .catch((error) => {
      console.error(error);
      setErrorMsg('Error fetching polls, please try again later!');
    });
}, [getId]);

  //sort
  const [data, setData] = useState([]);
  //let getData = localStorage.getItem("event_data");
  //getData = JSON.parse([getData]);
  /*
  useEffect(() => {
    setLoading(true);
    const finalData = 
      {
        name: getData.name,
        description: getData.description,
        owner: props.props
      };
    setEventList([...datas].concat(finalData));
    
  },[0]);
*/
  //console.log(datas._id);
  //console.log(getId);
  //sorts items by date name and alphabetically
  const [sortItem, setSortItem] = useState('albums');

  useEffect(() => {
    const sortArray = type => {
      const types = {
        name: 'name',
        date: 'date',
      };
      const sortProp = types[type];
      const sorted = [...eventList].sort((a, b) => b[sortProp] - a[sortProp]);
      setData(sorted);
    };
    sortArray(sortItem);
  }, [sortItem]); 
  
  return (
      <>
      <div  variant="outline-primary" className ='d-flex flex-row-reverse fw-bold' >
      <select variant="outline-primary" onChange={(e) => setSortItem(e.target.value)}> 
        <option >sort by</option>
        <option value="name">name</option>
        <option value="date">date</option>
      </select>
          <br></br>
      <Button  
              onClick={(e) => setSortItem(e.target.value)} 
              value="alpha" 
              variant="outline-primary" 
              size="sm" 
              className="fw-bold text-black mx-3 px-3">A-Z
      </Button>
      </div>
      <br></br>
      { datas && (
      <div>
        { 
        eventList.map((datas) => 
        <div key={eventList._id}>
        <Card className="d-flex mb-3 px-3">
          <div>
          <div className="fw-bold text-primary px-4 mt-4">
            Event Name <span className="text-black">{ datas.name}</span>
            <div className='text-black'>
              hosted by {" "} 
              <span className="text-muted px-3"> 
                {ownerName}
              </span>
            </div>
          </div>
          <div className='text-muted  px-4'>
              Decription: {datas.description}
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
        </div>)
      }</div>
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