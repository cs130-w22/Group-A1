import React, { useState, useEffect } from 'react';
import {Card,Row, Col, ListGroup, Button, Alert, Modal, Form} from 'react-bootstrap';
import { createEvent, getEvent } from '../api/event';
import { getUserByUsername } from '../api/users';
import {Create} from './Create'
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import PollList from './PollList';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import EventPage from './EventPage';



//import { UserList } from './EventPage';
/*
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
*/

function EventList ()
{
  const [createdEvent,setCreatedEvent] =useState(false);
  const { id } = useParams();
  const [eventList, setEventList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [event,setEvent] = useState();
  const [thisID,setThisID] = useState("");
  const navigate = useNavigate();

  let getData = localStorage.getItem("persist_data");
  getData = JSON.parse(getData);
  
  let getUser = localStorage.getItem("user");
  getUser = JSON.parse(getUser);
  
  //gets saved stringfied JSON from eventpage to create list
  //this probably will be temp to show how it is working rn
  
  
  //this part is not working yet since apis are not ready
  //useEffect(() => {
   // getEvent(id)
   //   .then((res) => {
   //     const resEvents = res.data;
   //     setEventList(resEvents);
   //   })
   ///   .catch((error) => {
        //console.error(error);
        //setErrorMsg('Error fetching polls, please try again later!');
//      });
 // }, [id]);

  
  return (
      <>
      { getData ? (
      <div>
        <Card className="d-flex"  onClick={()=> navigate(`./eventpage/${getData.id}`)}>
          <div>
          <div className="fw-bold text-primary px-4 mt-4">
            Event Name <span className="text-black">{ getData?.name}</span>
            <div className='text-black'>
              hosted by {" "} 
              <span className="text-muted px-3"> 
                {getUser?.owner?.username}
              </span>
            </div>
          </div>
          <div className='text-muted  px-4'>
              Decription: {getData?.description}
          </div>
          <Row className="fw-bold text-secondary px-4 mb-2">
          <Col className=" fw-bold text-secondary ">
              When: 
                <p className = "text-black">
                starts at: {getData?.dates[0]}
                </p>
                {" "}
                <p className = "text-black">
                ends at: {getData?.dates[1]}
                </p>   
            </Col>
            <Col className=" fw-bold text-secondary ">
              What: {}
            </Col>
            </Row>
            <Row className="fw-bold text-secondary px-4 mb-4">
            <Col className=" fw-bold text-secondary ">
              Who: {getData?.coming?.username}
            </Col>
            <Col className=" fw-bold text-secondary ">
              Where: {}
            </Col>
          </Row>
          </div>
        </Card>
      </div>
      ):("")}
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