import React, { useState, useEffect, useContext } from 'react';
import {
  Card, Button, Alert, Container, Col, Row, Modal, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  addOption, createPoll, deletePoll, getPoll, updatePoll,
} from '../api/polls';
// import { ThemeProvider } from 'styled-components';
import PollOption from './PollOption';
import { EventContext } from '../utils/context';
import { EventButton } from './EventButton';

function Poll({
  pollId, pollData: data, editMode: editState, handleDelete,
}) {
  const { readOnly } = useContext(EventContext);
  const [pollData, setPollData] = useState(data);
  const [options, setOptions] = useState([]); // includes edit property for poll Option for now
  const [editMode, setEditMode] = useState(editState);
  const [votesAllowed, setVotesAllowed] = useState(1);
  const [errorMsg, setErrorMsg] = useState();
  const [pollTitle, setPollTitle] = useState(pollData?.question);

  const onDeleteOption = (deleted) => {
    const updatedOptions = options.filter((option) => option.data._id !== deleted._id);
    setOptions(updatedOptions);
  };

  useEffect(() => {
    if (pollId != null && pollId.length > 0) {
      getPoll(pollId).then((res) => {
        setPollData(res.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [pollId]);

  useEffect(() => {
    setPollTitle(pollData?.question);
  }, [pollData]);

  useEffect(() => {
    if (pollData.options != null) {
      const newOptions = [];
      const pollOptions = pollData.options;
      for (let i = 0; i < pollOptions.length; i += 1) {
        const option = {
          data: pollOptions[i],
          editing: false,
        };
        newOptions.push(option);
      }
      newOptions.sort((a, b) => b.data.voters.length - a.data.voters.length);
      setOptions(newOptions);
    }
  }, [pollData]);

  // useEffect(() => {
  //   console.log(options);
  // }, [options]);

  const createNewOption = () => {
    if (readOnly) return;
    addOption(pollId, 'New Option')
      .then((res) => {
        const option = {
          data: res.data,
          editing: true,
        };
        setOptions((prevOptions) => [...prevOptions, option]);
      }).catch((error) => {
        console.log(error);
        setErrorMsg('Something went wrong! Please try again later.');
      });
  };

  const allowEdits = () => {
    if (!readOnly) setEditMode(true);
  };

  const savePoll = (e) => {
    // update poll
    e.preventDefault();
    if (readOnly) return;
    if (pollTitle.length === 0) setErrorMsg('Poll title cannot be empty!');
    else {
      updatePoll(pollId, { question: pollTitle, votesAllowed: votesAllowed})
        .then((res) => {
          setEditMode(false);
          setPollData(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleChange = (e) => {
    if (readOnly) return;
    setPollTitle(e.target.value);
    if (e.target.value.length > 0) setErrorMsg('');
  };

  const onDelete = (e) => {
    if (readOnly) return;
    deletePoll(pollId).then((res) => {
      handleDelete(res.data._id);
    }).catch((err) => console.log(err));
  };

  const voteOptions = () => {
    let voteOpts = [<option key={0} value={1}>{1}</option>]
    for (let i = 1; i < options.length; i++) {
      voteOpts.push(<option key={i} value={i+1}>{i+1}</option>)
    }
    return voteOpts;
  }

  const updateVotesAllowed = e => setVotesAllowed(e.target.value);

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Card id={pollId} className="border py-4 px-4 mb-3">
        {!editMode && (

          <h3 className="fs-5 mb-0 fw-bold">{pollTitle}</h3>

        )}
        {editMode && (
          <div className="d-flex">
            <Form className="w-100 d-flex" onSubmit={savePoll}>
              <Form.Control
                type="text"
                placeholder="Poll Title"
                onChange={handleChange}
                value={pollTitle || ''}
              />
            </Form>
            <div class="form-group">
            <label for="vote-range">Votes Allowed</label>
            <select class="form-control" id="exampleFormControlSelect1" onChange={updateVotesAllowed} value={votesAllowed}>
              {voteOptions()}
    </select>
            </div>
            <EventButton variant="success" className="ms-2 " onClick={savePoll}>save</EventButton>
            <EventButton variant="danger" className="ms-2 " onClick={onDelete}>delete</EventButton>
          </div>
        )}
        <hr />
        {options.length === 0 && <p className="text-muted">No options yet!</p>}
        {options.map((option, i) => (
          <PollOption
            key={option.data._id}
            keyProp={i}
            data={option.data}
            editing={option.editing}
            onDelete={onDeleteOption}
            onError={setErrorMsg}
          />
        ))}
        <span className="d-flex">
          <EventButton variant="primary fw-bold me-2" className="mt-2" onClick={createNewOption} readOnly={readOnly}>add option</EventButton>
          <EventButton variant="outline-primary fw-bold" className="mt-2" onClick={allowEdits} readOnly={readOnly} hidden={editMode}>edit poll</EventButton>
        </span>
      </Card>
    </>
  );
}

Poll.propTypes = {
  pollId: PropTypes.string.isRequired,
  pollData: PropTypes.shape({
    _id: PropTypes.string,
    question: PropTypes.string,
    addOptionEnabled: PropTypes.bool,
    maxOptionId: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.object),
    votesAllowed: PropTypes.number,
  }).isRequired,
};

export default Poll;
