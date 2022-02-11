import React, { useState, useEffect } from 'react';
import {
  Card, ListGroup, Button, Alert, Modal, Form,
} from 'react-bootstrap';
import { ThemeProvider } from 'styled-components';
import { createPoll, getPolls } from '../api/polls';
import Poll from './Poll';

function PollList() {
  const [pollList, setPollList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [creating, setCreating] = useState(false);
  const [creatingPoll, setCreatingPoll] = useState();
  const handleDelete = (deleted) => {
    const updatedPollList = pollList.filter((poll) => poll.data._id !== deleted);
    setPollList(updatedPollList);
  };
  const handleClose = () => {
    setCreating(false);
  };
  useEffect(() => {
    getPolls()
      .then((res) => {
        const resPolls = res.data;
        const polls = [];
        for (let i = 0; i < resPolls.length; i += 1) {
          const pollId = resPolls[i]._id;
          polls.push(<Poll
            key={i}
            pollId={pollId}
            pollData={resPolls[i]}
            editMode={false}
            handleDelete={handleDelete}
            handleClose={handleClose}
          />);
        }
        setPollList(polls);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching polls, please try again later!');
      });
  }, []);

  const createNewPoll = () => {
    // check if allowed
    setCreating(true);
    createPoll('Placeholder Name', 0, 2, true)
      .then((createdPoll) => {
        const poll = (
          <Poll
            key={pollList.length}
            pollId={createdPoll.data._id}
            pollData={createdPoll.data}
            editMode
            handleDelete={handleDelete}
            handleClose={handleClose}
          />
        );
        setPollList((p) => [p, poll,
        ]);
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
      {pollList}
      <Button onClick={createNewPoll}>add Poll</Button>
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
