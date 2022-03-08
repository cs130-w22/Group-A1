import React, {
  useContext, useEffect, useState,
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

/**
 * Component representing a single PollOption
 * @param {string} pollId parent Poll identifier ('0' if new poll that has not been saved yet)
 * @param {Object} data PollOption data from database ({_id: ObjectId, text: string, voters:[]})
 * @param {boolean} editing true if PollOption is in edit mode
 * @param {boolean} pollState true if parent Poll is in edit mode
 * @param {boolean} votable true if User can vote in PollOption's parent Poll
 * @param {callback} onDelete callback function to remove PollOption from parent Poll on delete
 * @param {callback} votingToggle callback function to edit parent Poll canVote state on PollOption vote change
 * @param {callback} onUpdate callback function to update parent Poll with current PollOption
 * @return {JSX.Element}
 * @constructor
 */
function PollOption({ pollId, data, editing, pollState, votable, onDelete, votingToggle, onUpdate }) {
  const { user } = useContext(UserContext);
  const { readOnly } = useContext(EventContext);
  const [optionId, setOptionId] = useState(data._id);
  const [optionText, setOptionText] = useState(data.text);
  const [checked, setChecked] = useState(!!data.voters.find((voter) => voter._id === user.userId));
  const [editMode, setEditMode] = useState(editing);
  const [votes, setVotes] = useState(data.voters);

  useEffect(() => {
    setVotes(data.voters);
  }, [data, optionId]);

  /**
   * Function to add/remove User's vote from poll
   */
  const changeVote = () => {
    voteOption(optionId).then((res) => {
      console.log(res);
      if (checked) {
        votingToggle(true);
        setVotes(votes.filter((voter) => voter._id !== user.userId));
        setChecked(!checked);
      } else {
        if (res.status === 201) {
          votingToggle(false);
        }
        if (res.status === 202) {
          alert("Maximum number of votes reached!");
        }
        else {
          setVotes([...votes, { _id: user.userId, username: user.username }]);
          setChecked(!checked);
        }
      }
    }).catch((err) => console.log(err));
  };

  /**
   * Function to save PollOption on button click
   * @param e
   */
  const saveText = (e) => {
    e.preventDefault();
    if (readOnly) return;
    if (typeof optionId === 'number') { //new option case
      if (pollId !== '0') { // adding option to an existing poll
        addOption(pollId, optionText)
            .then((opt) => {
              console.log(opt);
              setOptionId(opt.data._id);
              setEditMode(false);
            }).catch((err) => console.error('option cannot be empty'));
      }
    }
    else {
      updateOption(optionId, {text: optionText})
          .then((opt) =>{
            setOptionId(opt.data._id);
            setEditMode(false)
          })
          .catch((err) => console.log(err));
    }
  };

  /**
   * Function to handle PollOption text changes and propagate them to parent Poll
   * @param e
   */
  const handleChange = (e) => {
    if (readOnly) return;
    setOptionText(e.target.value);
    onUpdate(optionId, e.target.value);
  };

  /**
   * Function to change editMode on Edit Button click
   */
  const allowEdits = () => {
    if (readOnly) return;
    setEditMode(true);
  };

  /**
   * Function to delete PollOption and propagate change to parent Poll
   */
  const removeOption = () => {
    if (readOnly) return;
    if (typeof optionId === 'string') {
      deleteOption(optionId)
        .then((res) => {
          onDelete(res.data);
        })
        .catch((err) => console.log(err));
    }
    else {
      onDelete(data);
    }
  };

  /**
   * Component that displays PollOption voters as Tooltip
   * @returns {JSX.Element}
   */
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
          {(!editMode && !pollState)
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

                    <input className="form-check-input mt-2 mb-2 ms-2" type="checkbox" checked={checked} readOnly disabled={!checked && !votable} onClick={changeVote} />
                  </span>
                </OverlayTrigger>
              </div>
            )}
        </div>
        {' '}
        {(editMode || pollState) && (
          <Form className="w-100 d-flex ms-n2" onSubmit={saveText}>
            <Form.Control
              key={'poll-text-'.concat(optionId)}
              id={'poll-text'.concat(optionId)}
              type="text"
              placeholder="Enter Poll Option"
              onChange={handleChange}
              //readOnly={!editMode}
              value={optionText || ''}
            />
            {!pollState &&
              (<Button
                variant="success"
                className="align-self-center ms-2"
                hidden={!editMode}
                onClick={saveText}
              >
                Save
              </Button>)
            }
            {(editMode || pollState) &&
              (<Button variant="secondary" className="align-self-center ms-2 text-white" onClick={removeOption}>Delete</Button>)}
          </Form>

        )}
        <span hidden={editMode || pollState} className="mx-3 text-nowrap flex-grow-1">{optionText}</span>

        <OverlayTrigger
          placement="right"
          overlay={votesOverlay()}
        >
          <span className="voteCount" hidden={editMode || pollState}>
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
