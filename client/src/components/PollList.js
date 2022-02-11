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
    const updatedPollList = pollList.filter((poll) => poll._id !== deleted);
    setPollList(updatedPollList);
  };
  const handleClose = () => {
    setCreating(false);
  };
  useEffect(() => {
    getPolls()
      .then((res) => {
        const resPolls = res.data;
        setPollList(resPolls);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching polls, please try again later!');
      });
  }, []);

  // useEffect(() => {
  //   console.log(pollList);
  // }, [pollList]);

  const createNewPoll = () => {
    // check if allowed
    setCreating(true);
    createPoll('Placeholder Name', 0, 2, true)
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
        />
      ))}
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
