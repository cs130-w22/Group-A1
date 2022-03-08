import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  ListGroup,
  Button,
  Alert,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { ThemeProvider } from 'styled-components';
import { getEventPolls } from '../api/event';
import { EventContext } from '../utils/context';
import { EventButton } from './EventButton';
import Poll from './Poll';

function PollList() {
  const { eventId, readOnly, archived } = useContext(EventContext);
  const [pollList, setPollList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [creating, setCreating] = useState(false);
  const [creatingPoll, setCreatingPoll] = useState();

  const handleDelete = (deleted) => {
    const updatedPollList = pollList.filter((poll) => poll.pData._id !== deleted);
    setPollList(updatedPollList);
  };

    /**
     * Callback for adding Poll to PollList
     * @callback updatePollList
     * @param {Poll} poll Poll to add to PollList
     */
  const updatePollList = (poll) => {
    setPollList([...pollList, poll]);
  }

  const refreshPolls = () => {
    setPollList([]);
    getEventPolls(eventId)
      .then((res) => {
        const resPolls = res.data.list;
        setPollList(resPolls.map((resPoll) => resPoll)); //poll list contains poll data (pData) and voting ability (canVote)
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching polls, please try again later!');
      });
  }

  const handleClose = () => {
    setCreating(false);
  };

  useEffect(() => {
    getEventPolls(eventId)
      .then((res) => {
        const resPolls = res.data.list;
        setPollList(resPolls.map((resPoll) => resPoll)); //poll list contains poll data (pData) and voting ability (canVote)
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching polls, please try again later!');
      });
  }, [eventId]);

  const createNewPoll = () => {
    // check if allowed
    if (readOnly) return;
    setCreating(true);
    const createPollData = {
      question: '',
      options: null
    }
    const poll = (
      <Poll
        key={pollList.length}
        pollId='0'
        pollData={createPollData}
        editMode
        votable={true}
        handleDelete={handleDelete}
        handleClose={handleClose}
        readOnly={readOnly}
        updater={updatePollList}
        onRefresh={refreshPolls}
      />
    );
    setCreatingPoll(poll);
  };

  return (
    <div>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {pollList.map((poll) => (
        <Poll
          key={poll.pData._id}
          pollId={poll.pData._id}
          pollData={poll.pData}
          editMode={false}
          votable={poll.canVote}
          handleDelete={handleDelete}
          handleClose={handleClose}
          readOnly={readOnly}
          updater={updatePollList}
          onRefresh={refreshPolls}
        />
      ))}

      <EventButton
        onClick={createNewPoll}
        readOnly={readOnly}
        archived={archived}
      >
        + add poll
      </EventButton>
      <Modal show={creating} onHide={handleClose}>
        <Modal.Header closeButton>
          <h3 className='fw-bold text-secondary'>create poll</h3>
        </Modal.Header>
        <Modal.Body>
          <Card>{creatingPoll}</Card>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PollList;
