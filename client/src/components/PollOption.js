import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  ToggleButton, Button, CloseButton, Form, Row, Col, Container, Overlay, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import {
  addOption, deleteOption, updateOption, voteOption,
} from '../api/polls';
import EditIcon from '../assets/edit_icon_small.svg';
import { UserContext, EventContext } from '../utils/context';
import { EventButton, overlayFunction } from './EventButton';

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
  const { readOnly } = useContext(EventContext);
  const optionId = data._id;
  const [optionText, setOptionText] = useState(data.text);
  const [checked, setChecked] = useState(data.voters.includes(user.userId));
  const [voteMode, setVoteMode] = useState(readOnly);
  const [editMode, setEditMode] = useState(editing);
  const [votes, setVotes] = useState(data.voters);

  const changeVote = (e) => {
    voteOption(data._id).then((res) => {
      console.log("checked", checked);
      if (checked) {
        setVoteMode(true);
        setVotes(votes.filter((voter) => res.data.voters.includes(voter._id)));
        setChecked(!checked);
      } else {
        if (res.status === 202) {
          setVoteMode(false);
          alert("Maximum number of votes reached!");
        }
        else {
          setVoteMode(true);
          setVotes([...votes, { _id: user.userId, username: user.username }]);
          setChecked(!checked);
        }

      }

    }).catch((err) => console.log(err));
  };

  const saveText = (e) => {
    e.preventDefault();
    if (readOnly) return;
    updateOption(optionId, { text: optionText })
      .then(() => setEditMode(false))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    if (readOnly) return;
    setOptionText(e.target.value);
  };

  const allowEdits = () => {
    if (readOnly) return;
    setEditMode(true);
  };

  const removeOption = () => {
    if (readOnly) return;
    if (optionId) {
      deleteOption(optionId)
        .then((res) => {
          onDelete(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    setVotes(data.voters);
  }, [data]);

  const votesOverlay = () => (
    <Tooltip hidden={votes.length === 0}>
      {votes.map((voter, i) => [
        i > 0 && ', ',
        <span key={voter.username}>{voter.username}</span>,
      ])}
    </Tooltip>
  );

  return (
    <Container className="px-1 mb-3">

      <div className="d-flex justify-content-between align-items-center">
        <div className="pe-2 flex-shrink-1 d-flex align-items-center">
          {!editMode
            && (
              <div>
                <EventButton
                  className="color-secondary align-self-center mb-3 me-3 p-0"
                  style={editButton}
                  hidden={editMode}
                  onClick={allowEdits}
                  readOnly={readOnly}
                >
                  <img src={EditIcon} alt="Edit" />
                </EventButton>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    overlayFunction(readOnly)
                  }
                >
                  <span>

                    <input className="form-check-input mt-2 mb-2 ms-2" type="checkbox" checked={checked} readOnly disabled={readOnly} onClick={changeVote} />
                  </span>
                </OverlayTrigger>
              </div>
            )}
          {/* <ToggleButton
            variant="link"
            id={'vote-button'.concat(optionId)}
            checked={checked}
            onClick={changeVote}
            disabled={editMode}
          >
            {checked ? '☑' : '☐'}
          </ToggleButton> */}

        </div>
        {' '}
        {editMode && (
          <Form className="w-100 d-flex ms-n2" onSubmit={saveText}>
            <Form.Control
              key={'poll-text-'.concat(optionId)}
              id={'poll-text'.concat(optionId)}
              type="text"
              placeholder="Enter Poll Option"
              onChange={handleChange}
              // readOnly={!editMode}
              value={optionText || ''}
            />
            <Button
              variant="success"
              className="align-self-center ms-2"
              hidden={!editMode}
              onClick={saveText}
            >
              Save
            </Button>
            <Button variant="secondary" className="align-self-center ms-2 text-white" onClick={removeOption}>Delete</Button>
          </Form>

        )}
        <span hidden={editMode} className="mx-3 text-nowrap flex-grow-1">{optionText}</span>

        <OverlayTrigger
          placement="right"
          overlay={votesOverlay()}
        >
          <span className="voteCount" hidden={editMode}>
            Votes:
            {' '}
            {votes.length}
          </span>
        </OverlayTrigger>
      </div>

    </Container>
  );
}

export default PollOption;
