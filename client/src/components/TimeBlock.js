import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Schedule } from './styled/availability.styled';

function TimeBlock({
  users, members,
}) {

  const [percent, setPercent] = useState(0);
  const [unavailable, setUnavailable] = useState([]);

  useEffect(() => {
    setPercent(users.length / members.length);
    setUnavailable(members.filter((m) => users.find((user) => (user._id === m._id)) == null));
  }, [members, users]);

  const overlayFunction = () => (
    <Tooltip hidden={users.length === 0 || false}>
      <p className="fw-bold">
        {users.length}
        /
        {members.length }
        {' '}
        available
      </p>
      <span className="fw-bold">Available</span>
      <ul className="list-unstyled">
        {users.map((user) => (
          <li key={user._id}>{user.username}</li>))}
      </ul>
      <span className="fw-bold">Unavailable</span>
      <ul className="list-unstyled">
        {unavailable.length === 0 && <li>None</li>}
        {unavailable.map((user) => (
          <li key={user._id}>{user.username}</li>))}
      </ul>
    </Tooltip>
  );

  return (
    <div>
      <OverlayTrigger
        placement="right"
        overlay={
        overlayFunction()
      }
      >
        {percent > 0 ? (
          <Schedule
            className="mt-1"
            style={{ backgroundColor: `rgba(125, 28, 173, ${percent})` }}
          />
        ) : (
          <Schedule
            className="mt-1 border"
          />
        )}
      </OverlayTrigger>
    </div>
  );
}
TimeBlock.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default TimeBlock;
