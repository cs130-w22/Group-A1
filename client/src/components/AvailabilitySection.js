import React, {
  useContext,
} from 'react';
import { EventContext } from '../utils/context';
import Selector from './Selector';
import { SectionTitle } from './styled/headers';

function AvailabilitySection({ dates, timeEarliest, timeLatest }) {
  const { readOnly } = useContext(EventContext);
  return (
    <div>
      <SectionTitle className="mt-5">Availability ⏰</SectionTitle>
      {!readOnly ? <Selector dates={dates} timeEarliest={timeEarliest} timeLatest={timeLatest} />
        : (<p>You must be a member of this event to select your availability.</p>)}
    </div>
  );
}

export default AvailabilitySection;
