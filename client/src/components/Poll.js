import React, { useState, useEffect, useContext } from 'react';
import {
  Card, Alert, Form,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {
  addOption, deletePoll, createPoll, updatePoll,
} from '../api/polls';
import PollOption from './PollOption';
import { EventContext } from '../utils/context';
import { EventButton } from './EventButton';

function Poll({
  pollId, pollData: data, editMode: editState, handleDelete, handleClose, votable, updater
}) {
  const { eventId, readOnly } = useContext(EventContext);
  const [pollData, setPollData] = useState(data);
  const [options, setOptions] = useState( data.options ? data.options.map((opt) => {
    return {data: opt, editing: false}
  }) : null); // includes edit property for poll Option for now
  const [editMode, setEditMode] = useState(editState);
  const [votesAllowed, setVotesAllowed] = useState(1);
  const [errorMsg, setErrorMsg] = useState();
  const [pollTitle, setPollTitle] = useState(data.question);
  const [canVote, setCanVote] = useState(votable);

  const toggleVoting = (toSet) => {
    setCanVote(toSet);
  }

  const onDeleteOption = (deleted) => {
    setOptions(options.filter((option) => option.data._id !== deleted._id));
  };

  const updateOptionInList = (optionId, text) => {
    if (typeof optionId === 'number' && pollId === '0') {
      let newOptions = [].concat(options);
      newOptions[optionId].data.text = text;
      setOptions(newOptions);
      console.log(newOptions);
    }
  };

  useEffect(() => {
    setPollTitle(pollData?.question);
  }, [pollData]);

  useEffect(() => {
    console.log("updatingOptions");
    if (pollData.options != null) {
      const newOptions = [];
      const pollOptions = pollData.options;
      console.log(pollOptions);
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
    else {
      const initialOptions = [];
      for (let i = 0; i < 2; i += 1) {
        const option = {
          data: {
            _id: i,
            text: '',
            voters: [],
          },
          editing: false,
        };
        initialOptions.push(option);
      }
      setOptions(initialOptions);
    }
  }, [pollData, editMode]);

  const createNewOption = () => {
    if (readOnly) return;
      const option = {
        data: {
          _id: options.length,
          text: '',
          voters: [],
        },
        editing: true,
      }
      setOptions([...options, option]);
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
      if (pollId === '0') { //new poll case
        console.log("creating new poll");
        console.log(options.length);
        createPoll(eventId, pollTitle, options.length, votesAllowed, true).then(async (created) => {
          let createdWithOpts = created.data;
          console.log(created);
          let savedOpts = options.map((opt) => addOption(createdWithOpts.pData._id, opt.data.text));
          let resolved = await Promise.all(savedOpts);
          console.log("resolved", resolved);
          setEditMode(false);
          createdWithOpts.pData.options = resolved.map((x) => x.data);
          setPollData(createdWithOpts.pData);
          console.log(pollData);
          updater(created.data);
          setOptions(resolved.map((x) => ({data: x.data, editing: false})));
        }).catch((err) => console.log(err));
        handleClose();
      }
       else {
        updatePoll(pollId, {question: pollTitle, votesAllowed: votesAllowed})
            .then((res) => {
              setEditMode(false);
              setPollData(res.data.pData);
            })
            .catch((err) => console.log(err));
      }
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
    for (let i = 1; i < pollData.maxOptionId; i++) {
      voteOpts.push(<option key={i} value={i+1}>{i+1}</option>)
    }
    return voteOpts;
  }

  const updateVotesAllowed = e => setVotesAllowed(e.target.value);

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Card id={pollId} key={pollId} className="border py-4 px-4 mb-3">
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
                value={pollTitle}
              />
            </Form>
            <EventButton variant="success" className="ms-2 " onClick={savePoll}>save</EventButton>
            <EventButton variant="danger" className="ms-2 " onClick={onDelete}>delete</EventButton>
          </div>
        )}
        <hr />
        {editMode && (
          <div class="form-group">
            <label for="vote-range">Votes Allowed</label>
            <select class="form-control input-small" id="exampleFormControlSelect1" onChange={updateVotesAllowed} value={votesAllowed}>
                {voteOptions()}
            </select>
          </div>
        )}
        {!editMode && (
            <div className="row">
              <div className="col-md-6">Votes Allowed: {votesAllowed} </div>
              {!canVote && <div className="col-md-6 text-right text-warning">Maximum Number of Votes Reached!</div>}
            </div>
        )}
        <hr/>
        {(options === null || options.length === 0)  && <p className="text-muted">No options yet!</p>}
        {(options !== null) && options.map((option, i) => (
          <PollOption
            key={option.data._id || i}
            keyProp={i}
            pollId={pollId}
            pollState={editMode}
            data={option.data}
            editing={option.editing}
            votable={canVote}
            votingToggle={toggleVoting}
            onDelete={onDeleteOption}
            onUpdate={updateOptionInList}
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
