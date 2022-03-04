import React from 'react';
import PollList from './PollList';
import { SectionTitle } from './styled/headers';

function PollSection({ eventId, readOnly, archived }) {
  return (
    <div>
      <SectionTitle className="mt-5">Polls 🗳️</SectionTitle>
      <PollList eventId={eventId} readOnly={readOnly} archived={archived} />
    </div>
  );
}
export default PollSection;
