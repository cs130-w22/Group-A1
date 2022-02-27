import React, {
  useContext, useState,
} from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import { EventContext } from '../utils/context';
import Selector from './Selector';
import { SectionTitle } from './styled/headers';
import Availability from './Availability';

function AvailabilitySection({ members, timeEarliest, timeLatest }) {
  const { readOnly } = useContext(EventContext);
  const [view, setView] = useState('view');
  const handleSelect = (e) => {
    setView(e);
  };

  const viewMode = () => (
    <div style={{ display: view !== 'view' ? 'none' : 'inherit' }}>
      <Availability timeEarliest={timeEarliest} timeLatest={timeLatest} members={members} />
    </div>
  );
  const editMode = () => (
    <div style={{ display: view === 'view' ? 'none' : 'inherit' }}>
      <Selector timeEarliest={timeEarliest} timeLatest={timeLatest} />
      {readOnly && <p>You must be a member of this event to select your availability.</p>}
    </div>
  );
  return (
    <div>
      <div className="d-flex">
        <SectionTitle className="mt-5 mb-4">Availability ⏰</SectionTitle>
        <Nav variant="pills" className="mb-2 fw-bold avail-tabs ms-3" defaultActiveKey="view" onSelect={handleSelect}>
          <Nav.Item>
            <Nav.Link eventKey="view">group schedule</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="edit">my availability</Nav.Link>
          </Nav.Item>
        </Nav>

      </div>
      <div>
        {viewMode()}
        {editMode()}
      </div>
    </div>
  );
}

AvailabilitySection.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object),
  timeEarliest: PropTypes.number,
  timeLatest: PropTypes.number,
};

AvailabilitySection.defaultProps = {
  members: [],
  timeEarliest: 0,
  timeLatest: 23,
};
export default AvailabilitySection;
