import React, { useEffect, useState } from 'react';
import { Schedule } from './styled/availability.styled';

function TimeSelectBlock({
    hour, selected, selecting, append, innerRef, x,
}) {
    const [selectedClass, setSelectedClass] = useState();
    useEffect(() => {
        if (append && (selecting || selected))
            setSelectedClass('selected');
        else if (!append) {
            if (!selecting && selected) {
                setSelectedClass('selected');
            } else
                setSelectedClass('');
        } else
            setSelectedClass('');
    }, [selecting, selected, setSelectedClass, append]);
    return <Schedule ref={innerRef} className={`mt-1 ${selectedClass}`} />;
}

export default TimeSelectBlock;