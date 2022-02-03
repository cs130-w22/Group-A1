import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Button } from 'react-bootstrap';
import { ThemeProvider } from 'styled-components';
import { createPoll, getPolls } from '../api/polls';
import Poll from './Poll';

function PollList() {
  const [pollList, setPollList] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getPolls()
      .then((res) => {
        const resPolls = res.data;
        const polls = [];
        for (let i = 0; i < resPolls.length; i += 1) {
          const pollId = resPolls[i]._id;
          polls.push(<Poll key={i} pollId={pollId} thisPoll={resPolls[i]} />);
        }
        setPollList(polls);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error fetching polls, please try again later!');
      });
  }, []);

  const createNewPoll = () => {
    createPoll('Placeholder Name', 0, 2, true)
      .then((createdPoll) => {
        setPollList((p) => [p, <Poll key={pollList.length} pollId={createdPoll._id} />]);
      })
      .catch((error) => {
        console.error(error);
        setErrorMsg('Error creating a poll, please try again later!');
      });
  };

  return (
    <div>
      {pollList}
      <Button onClick={createNewPoll}>add Poll</Button>
    </div>
  );
}

export default PollList;
