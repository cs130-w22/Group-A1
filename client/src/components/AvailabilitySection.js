import React, { useContext } from 'react';
import { EventContext } from '../utils/context';
import { SectionTitle } from './styled/headers';

function AvailabilitySection() {
  const { eventId, readOnly } = useContext(EventContext);
  return (
    <div>
      <SectionTitle className="mt-5">Availability ⏰</SectionTitle>
      <p>Availability picker goes here</p>
    </div>
  );
}

export default AvailabilitySection;
