import React, { useState, useEffect } from 'react';
import { Card, Button,Container,Col,Row, Modal } from 'react-bootstrap';
import { addOption, getPoll } from '../api/polls';
// import { ThemeProvider } from 'styled-components';
import PollOption from './PollOption';

function Poll({ pollId, thisPoll }) {
  const [pollData, setPollData] = useState({});
  const [options, setOptions] = useState([]); // includes edit property for poll Option for now
  const [editMode, setEditMode] = useState(false);
  const fetchURL = `http://localhost:5000/poll/getoptions?pollID=${pollId}`;

  const onDelete = (deleted) => {
    const updatedOptions = options.filter((option) => option.data._id !== deleted._id);
    setOptions(updatedOptions);
  };

  useEffect(() => {
    if (pollId != null) {
      getPoll(pollId).then((res) => {
        setPollData(res.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [pollId]);

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
      }).catch((error) => { console.log(error); });
  };

  const allowEdits = () => {
    setEditMode(true);
  };

  const savePoll = () => {
    setEditMode(false);
  };
  function getPlls()
  {
    
  }
  //handles the modal close/open
  const[shw,setShw] = useState();

  return (
  
<Container>
  <Button id={pollId} className="border py-1 px-5 mb-3 bg-light "  className="mb-3" 
    onClick={()=>setShw(true)} type="button" class="btn btn-primary" 
    data-toggle="modal" data-target="#myModal">
  <h3 className=' fs-5 '>{pollData?.question}</h3>
  </Button>
  <Modal show={shw} onHide={()=>setShw(false)}>
    <Modal.Header closeButton >
        <h3 className='fs-5 mb-0 fw-bold'>{pollData?.question}</h3>
      </Modal.Header>
    <Modal.Body>
      <Card >
          <hr />
          {options.map((option, i) => (
        <PollOption
          key={option.data._id}
          keyProp={i}
          data={option.data}
          editing={option.editing}
          onDelete={onDelete}
        />
        ))}
        <Modal.Footer>
          <Button className=" mb-3" onClick={createNewOption}>add option</Button>
          <Button className="mb-3" onClick={savePoll} hidden={!editMode}>save poll</Button>
          <Button className="mb-3" onClick={allowEdits} hidden={editMode}>edit poll</Button>
          <Button className="mb-3 bg-secondary " >Delete</Button>
        </Modal.Footer>
    </Card>
    </Modal.Body>
    </Modal>
    </Container>

  );
}
export default Poll;
