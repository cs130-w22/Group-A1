import React, { useEffect, useState } from 'react';
import { Schedule } from './styled/availability.styled';

function TimeBlock({
  hour, users, maxUsers, append,
}) {
  const [selectedClass, setSelectedClass] = useState();
  return <Schedule className="mt-1 " />;
}

export default TimeBlock;
