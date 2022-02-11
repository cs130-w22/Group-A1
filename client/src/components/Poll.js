import React, { useState, useEffect } from 'react';
import {
  Card, Button, Alert, Container, Col, Row, Modal, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  addOption, createPoll, deletePoll, getPoll, updatePoll,
} from '../api/polls';
// import { ThemeProvider } from 'styled-components';
import PollOption from './PollOption';

function Poll({
  pollId, pollData: data, editMode: editState, handleDelete,
}) {
  const [pollData, setPollData] = useState(data);
  const [options, setOptions] = useState([]); // includes edit property for poll Option for now
  const [editMode, setEditMode] = useState(editState);
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
    setEditMode(true);
  };

  const savePoll = (e) => {
    // update poll
    e.preventDefault();
    if (pollTitle.length === 0) setErrorMsg('Poll title cannot be empty!');
    else {
      updatePoll(pollId, { question: pollTitle })
        .then((res) => {
          setEditMode(false);
          setPollData(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleChange = (e) => {
    setPollTitle(e.target.value);
    if (e.target.value.length > 0) setErrorMsg('');
  };

  const onDelete = (e) => {
    deletePoll(pollId).then((res) => {
      handleDelete(res.data._id);
    }).catch((err) => console.log(err));
  };

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
            <Button variant="success" className="ms-2 " onClick={savePoll}>save</Button>
            <Button variant="danger" className="ms-2 " onClick={onDelete}>delete</Button>
          </div>
        )}
        <hr />
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
        <Button className="mt-2" onClick={createNewOption}>add option</Button>

        <Button className="mt-2" onClick={allowEdits} hidden={editMode}>edit poll</Button>
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
