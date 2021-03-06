import { format, parse } from 'date-fns';
import React, {
  useEffect, useState,
} from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import LoadingIndicator from './LoadingIndicator';
import { ScheduleTime } from './styled/availability.styled';
import TimeBlock from './TimeBlock';

// referenced from https://github.com/pablofierro/react-drag-select/blob/master/lib/Selection.js

/**
 * Returns event's Availability selector
 * @param availability User's availability
 * @param timeEarliest earliest time Event could be
 * @param timeLatest latest time Event could be
 * @param members Event members
 * @returns {JSX.Element} React component representing Availability selector
 * @constructor
 */
function Availability({
  availability, timeEarliest, timeLatest, members,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const createTimeBlock = ({ _id, hour, userList }) => ({
    _id,
    hour,
    users: userList,
  });
  const createDayBlock = ({ day, times }) => {
    const timeblocks = [];
    const date = (parse(day, 'D', new Date(), { useAdditionalDayOfYearTokens: true }));
    const sortedTimes = times.sort((a, b) => a.hour - b.hour);
    sortedTimes.forEach((time) => {
      timeblocks.push(createTimeBlock(time));
    });
    return {
      date,
      timeblocks,
    };
  };
  // get original availability
  useEffect(() => {
    setLoading(true);

    let days = [];
    availability.forEach((day) => {
      const d = createDayBlock(day);
      days.push(d);
    });
    days = days.sort((a, b) => a.day - b.day);
    const tempRows = [];
    for (let i = 0; i < days.length; i += 7) {
      const d = [];
      for (let j = i; j < i + 7 && j < days.length; j += 1) {
        d.push(days[j]);
      }
      tempRows.push(d);
    }
    setRows(tempRows);
    setLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability]);

  const earliest = Math.max(0, timeEarliest);
  const range = (rangeStart, rangeStop, step) => Array.from(
    { length: (rangeStop - rangeStart) / step + 1 },
    (_, i) => `${rangeStart + (i * step)}:00`,
  );
  const hours = range(earliest, timeLatest, 1);

  return (
    <div>
      {loading && <LoadingIndicator />}
      {!loading && rows.length > 0 && (
      <div>
        {rows.map((row) => (
          <Row className="mb-5">
            <Col xs={1}>
              <Row>&nbsp;</Row>
              {hours.map((h) => (
                <Row>
                  <ScheduleTime className="mt-1 d-flex justify-content-center align-items-center text-center w-100">
                    {h}
                  </ScheduleTime>
                </Row>
              ))}
            </Col>
            {row.map((day) => (
              <Col className="me-2">
                <Row>
                  <div className="d-flex justify-content-center align-items-center no-select fw-bold text-secondary me-2">{format(day.date, 'ccc MM/dd')}</div>
                </Row>
                {day.timeblocks.map((block) => (
                  <TimeBlock
                    hour={block.hour}
                    key={block._id}
                    users={block.users}
                    members={members}
                  />
                ))}
              </Col>
            ))}
          </Row>
        ))}
      </div>
      )}
    </div>
  );
}

Availability.propTypes = {
  availability: PropTypes.arrayOf(PropTypes.object).isRequired,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  timeEarliest: PropTypes.number.isRequired,
  timeLatest: PropTypes.number.isRequired,
};
export default Availability;
