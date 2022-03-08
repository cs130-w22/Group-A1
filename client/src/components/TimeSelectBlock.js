import React, { useEffect, useState } from 'react';
import { Schedule } from './styled/availability.styled';

/**
 * Component to represent an individual time block button
 * @param hour
 * @param selected
 * @param selecting
 * @param append
 * @param innerRef
 * @returns {JSX.Element}
 * @constructor
 */
function TimeSelectBlock({
  hour, selected, selecting, append, innerRef,
}) {
  const [selectedClass, setSelectedClass] = useState();
  useEffect(() => {
    if (append && (selecting || selected)) { setSelectedClass('selected'); } else if (!append) {
      if (!selecting && selected) {
        setSelectedClass('selected');
      } else { setSelectedClass(''); }
    } else { setSelectedClass(''); }
  }, [selecting, selected, setSelectedClass, append]);
  return <Schedule ref={innerRef} className={`mt-1 ${selectedClass}`} />;
}

export default TimeSelectBlock;
