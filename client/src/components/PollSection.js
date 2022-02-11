import React from 'react';
import PollList from './PollList';
import { SectionTitle } from './styled/headers';

function PollSection() {
  return (
    <div>
      <SectionTitle className="mt-5">Polls 🗳️</SectionTitle>
      <PollList />
    </div>
  );
}
export default PollSection;
