import React from 'react';
import PollList from './PollList';
import { SectionTitle } from './styled/headers';

/**
 * Component that holds all a single instance of PollList
 * @param {string} eventId Event we will be displaying polls for
 * @param {boolean} readOnly true if User is not member of Event
 * @param {boolean} archived true if Event is archived
 * @return {JSX.Element}
 * @constructor
 */
function PollSection({ eventId, readOnly, archived }) {
  return (
    <div>
      <SectionTitle className="mt-5">Polls 🗳️</SectionTitle>
      <PollList eventId={eventId} readOnly={readOnly} archived={archived} />
    </div>
  );
}


export default PollSection;
