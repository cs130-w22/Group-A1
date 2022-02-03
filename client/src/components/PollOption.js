import React, { useContext, useEffect, useState } from 'react';
import {
  ToggleButton, Button, CloseButton, Form, Row, Col, Container,
} from 'react-bootstrap';
import {
  addOption, deleteOption, updateOption, voteOption,
} from '../api/polls';
import EditIcon from '../assets/edit_icon_small.svg';
import { UserContext } from '../utils/userContext';

const editButton = {
  boxSizing: 'content-box',
  width: '1em',
  height: '1em',
  color: '#000',
  background: 'transparent',
  border: '0',
  borderRadius: '0.25rem',
  opacity: '0.5',
};

function PollOption({ data, onDelete, editing }) {
  const { user } = useContext(UserContext);
  const optionId = data._id;
  const [optionText, setOptionText] = useState(data.text);
  const [checked, setChecked] = useState(data.voters.includes(user.userId));
  const [editMode, setEditMode] = useState(editing);
  const [votes, setVotes] = useState(data.voters.length);

  const changeVote = (e) => {
    voteOption(optionId).then((res) => {
      setVotes(res.data.voters.length);
      setChecked(!checked);
    }).catch((err) => console.log(err));
  };

  const saveText = (e) => {
    e.preventDefault();
    updateOption(optionId, { text: optionText })
      .then(() => setEditMode(false))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setOptionText(e.target.value);
  };

  const allowEdits = () => {
    setEditMode(true);
  };

  const removeOption = () => {
    if (optionId) {
      deleteOption(optionId)
        .then((res) => {
          onDelete(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    setVotes(data.voters.length);
  }, [data]);

  return (
    <Container className="px-1">

      <div className="d-flex justify-content-between">
        <Button
          style={editButton}
          hidden={editMode}
          onClick={allowEdits}
        >
          <img src={EditIcon} alt="Edit" />
        </Button>
        <CloseButton onClick={removeOption} />
        {editMode && (
          <Form className="w-75 d-flex" onSubmit={saveText}>
            <Form.Control
              key={'poll-text-'.concat(optionId)}
              id={'poll-text'.concat(optionId)}
              type="text"
              placeholder="Enter Poll Option"
              onChange={handleChange}
              // readOnly={!editMode}
              value={optionText || ''}
            />
          </Form>
        )}
        <ToggleButton
          id={'vote-button'.concat(optionId)}
          checked={checked}
          onClick={changeVote}
          disabled={editMode}
        >
          {checked ? 'Remove Vote' : 'Vote'}
        </ToggleButton>
        <p hidden={editMode} className="mx-3 text-nowrap w-50">{optionText}</p>
        <p className="voteCount" hidden={editMode}>
          Votes:
          {' '}
          {votes}
          {' '}
        </p>
      </div>

    </Container>
  );
}

export default PollOption;
