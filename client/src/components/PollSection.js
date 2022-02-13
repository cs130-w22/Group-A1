import React from 'react';
import PollList from './PollList';
import { SectionTitle } from './styled/headers';

function PollSection({ eventId }) {
  return (
    <div>
      <SectionTitle className="mt-5">Polls 🗳️</SectionTitle>
      <PollList eventId={eventId} />
    </div>
  );
}
export default PollSection;
