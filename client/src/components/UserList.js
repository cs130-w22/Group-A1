import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { CategoryTitle, SectionTitle } from './styled/headers';
import '../assets/custom.scss';
import { getPoll } from '../api/polls';
import { UserContext } from '../utils/context';


export function UserList({ users }) {
  const listItems = users.map((user) => (
    <li key={user._id || 'x'}>{user.username}</li>
  ));
  return <ul className="list-unstyled mb-4">{listItems}</ul>;
}
export function EventMembers({ coming, invited, declined, members, goingPoll, archived }) {
  const { user, setUser } = useContext(UserContext);
  const [selectedButton, setSelectedButton] = useState(0);  //0=maybe, 1 = going, 2 = notgoing
  const [currRSVP, setCurrRSVP] = useState();
  const [pollData, setPollData] = useState();
  const [going, setGoing] = useState(coming || []);
  const [notGoing, setNotGoing] = useState(declined || []);
  const [maybe, setMaybe] = useState(members.filter( ( el ) => !(coming.concat(declined)).includes( el ) ));


  const [pollOptions, setOptions] = useState();

  useEffect(() => {
    if (goingPoll != null && goingPoll.length > 0) {
      console.log(goingPoll);
      getPoll(goingPoll).then((res) => {
        setPollData(res.data);
      }).catch((err) => {
        console.log(err);
      });
    }
  }, [goingPoll]);

  useEffect(() => {
    if (pollData != undefined && pollData.options != null) {
      const newOptions = [];
      const pollOptions = pollData.options;
      for (let i = 0; i < pollOptions.length; i += 1) {
        const option = {
          data: pollOptions[i],
        };
        newOptions.push(option);
        if(option.data.text === 'Going')
          setGoing(option.data.voters);
        else if (option.data.text === 'Not Going')
          setNotGoing(option.data.voters);
      }
      setOptions(newOptions);
    }
  }, [pollData]);

  useEffect(() => {
    setMaybe(members.filter( ( el ) => !(notGoing.concat(going)).includes( el ) ));
  }, [going, notGoing, members])


  const handleSelection = (val) => {
    if(!archived){
      if(selectedButton === val)
        setSelectedButton(0);
      else 
        setSelectedButton(val);
    }

    if(selectedButton === 0){
      setGoing(going.filter((el) => (el !== user._id)));
      setNotGoing(notGoing.filter((el) => (el !== user._id)));

    }
    else if (selectedButton === 1){
      var currNotGoing = [...notGoing]
      setNotGoing(currNotGoing.filter((el) => !(el === user._id)));
      setGoing(going.concat(user._id));
    }
    else{
      var currGoing = [...going]
      setGoing(currGoing.filter((el) => !(el === user._id)));
      setNotGoing(notGoing.concat(user._id));
    }
  }
  
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between">
      <SectionTitle className="mb-3 flex-grow-1">Who&apos;s Coming?</SectionTitle>

      <Col className="flex-fill">
      <ToggleButtonGroup type="radio" name="options" defaultValue={currRSVP} value={selectedButton}>
        <ToggleButton 
          id="tbg-radio-1" 
          value={1}
          onClick={() => handleSelection(1)}
          className={selectedButton === 1 ? 'toggle-button-active text-white fw-bold' : 'toggle-button text-primary fw-bold'}
          size="sm">
          Going
        </ToggleButton>
        <ToggleButton 
          id="tbg-radio-2" 
          value={2}
          onClick={() => handleSelection(2)}
          className={selectedButton === 2 ? 'toggle-button-active text-white fw-bold' : 'toggle-button text-primary fw-bold'}
          size="sm">
          Not Going
        </ToggleButton>
      </ToggleButtonGroup>
      </Col>

      </div>

      <Row>
        <Col xs={6}>
          <CategoryTitle count={coming.length}>Coming</CategoryTitle>
          <UserList users={coming} />
        </Col>
        <Col xs={6}>
          <CategoryTitle count={members.length}>Members</CategoryTitle>
          <UserList users={members} />
        </Col>
        <Col xs={6}>
          <CategoryTitle count={invited.length}>Invited</CategoryTitle>
          <UserList users={invited} />
        </Col>
        <Col xs={6}>
          <CategoryTitle count={declined.length}>Not Coming</CategoryTitle>
          <UserList users={declined} />
        </Col>
      </Row>
    </Container>
  );
}
EventMembers.propTypes = {
  coming: PropTypes.arrayOf(PropTypes.object).isRequired,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  invited: PropTypes.arrayOf(PropTypes.object).isRequired,
  declined: PropTypes.arrayOf(PropTypes.object).isRequired,
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
