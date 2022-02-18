import React, { useState, useEffect, useContext } from 'react';
import {
  Card, ListGroup, Button, Alert, Modal, Form, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { ThemeProvider } from 'styled-components';
import { getEventPolls } from '../api/event';
import { createPoll, getPolls } from '../api/polls';
import { EventContext } from '../utils/context';
import { EventButton } from './EventButton';
import Poll from './Poll';

function PollList() {
  const { eventId, readOnly } = useContext(EventContext);
  const [pollList, setPollList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [creating, setCreating] = useState(false);
  const [creatingPoll, setCreatingPoll] = useState();
  const handleDelete = (deleted) => {
    const updatedPollList = pollList.filter((poll) => poll._id !== deleted);
    setPollList(updatedPollList);
  };
  const handleClose = () => {
    setCreating(false);
  };
  
  useEffect(() => {
    getEventPolls(eventId)
      .then((res) => {
        const resPolls = res.data;
        setPollList(resPolls);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching polls, please try again later!');
      });
  }, [eventId]);

  // useEffect(() => {
  //   console.log(pollList);
  // }, [pollList]);

  const createNewPoll = () => {
    // check if allowed
    if (readOnly) return;
    setCreating(true);
    createPoll(eventId, 'Placeholder Name', 0, 2, true)
      .then((createdPoll) => {
        setPollList([...pollList, createdPoll.data]);
        const poll = (
          <Poll
            key={pollList.length}
            pollId={createdPoll.data._id}
            pollData={createdPoll.data}
            editMode
            handleDelete={handleDelete}
            handleClose={handleClose}
            readOnly={readOnly}
          />
        );
        setCreatingPoll(poll);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error creating a poll, please try again later!');
      });
  };

  return (
    <div>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {pollList.map((poll) => (
        <Poll
          key={poll._id}
          pollId={poll._id}
          pollData={poll}
          editMode={false}
          handleDelete={handleDelete}
          handleClose={handleClose}
          readOnly={readOnly}
        />
      ))}

      <EventButton
        onClick={createNewPoll}
        readOnly={readOnly}
      >
        + add poll
      </EventButton>
      <Modal show={creating} onHide={() => setCreating(false)}>
        <Modal.Header closeButton>
          <h3>Create Poll</h3>
        </Modal.Header>
        <Modal.Body>
          <Card>
            {creatingPoll}
          </Card>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PollList;
