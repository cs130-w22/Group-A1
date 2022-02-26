import { format, parseISO } from 'date-fns';
import React, {
  useContext, useEffect, useState, createRef,
} from 'react';
import { Col, Row } from 'react-bootstrap';
import { changeAvailability, getAvailability, getUserAvailability } from '../api/event';
import { EventContext, UserContext } from '../utils/context';
import { Schedule, ScheduleTime, SelectBox } from './styled/availability.styled';
import { SectionTitle } from './styled/headers';

function TimeSelectBlock({
  hour, selected, selecting, append, innerRef, x,
}) {
  const [selectedClass, setSelectedClass] = useState();
  useEffect(() => {
    if (append && (selecting || selected)) setSelectedClass('selected');
    else if (!append) {
      if (!selecting && selected) {
        setSelectedClass('selected');
      } else setSelectedClass('');
    } else setSelectedClass('');
  }, [selecting, selected, setSelectedClass, append]);
  return <Schedule ref={innerRef} className={`mt-1 ${selectedClass}`} />;
}

// referenced from https://github.com/pablofierro/react-drag-select/blob/master/lib/Selection.js
function intersects(a, b) {
  if (
    a.left <= b.left + b.width
    && a.left + a.width >= b.left
    && a.top <= b.top + b.height
    && a.top + a.height >= b.top
  ) {
    return true;
  }
  return false;
}

function Selector({ dates, timeEarliest, timeLatest }) {
  const { eventId } = useContext(EventContext);
  const { user } = useContext(UserContext);
  const [mouseDown, setMouseDown] = useState(false);
  const [start, setStart] = useState();
  const [append, setAppend] = useState(null);
  const [origSelected, setOrigSelected] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selection, setSelection] = useState({});
  const [tempSelecting, setTempSelecting] = useState([]);
  const [selecting, setSelecting] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const selectableItems = new Map();

  // get original availability
  useEffect(() => {
    getAvailability(eventId, user.userId).then((res) => {
      console.log('beep');
      setBlocks(res.data);
      console.log(res.data);
      res.data.forEach((s) => {
        console.log(s._id);
      });
    });
  }, [eventId, user]);

  const updateSelection = (ref, e) => {
    const left = Math.min(ref.x, e.pageX);
    const top = Math.min(ref.y, e.pageY);
    const width = Math.abs(ref.x - e.pageX);
    const height = Math.abs(ref.y - e.pageY);
    setSelection({
      left,
      top,
      width,
      height,
    });
  };

  const downRef = React.useRef(mouseDown);
  const setDownRef = (data) => {
    downRef.current = data;
    setMouseDown(data);
  };

  const startRef = React.useRef(start);
  const setStartRef = (data) => {
    startRef.current = data;
    setStart(data);
  };

  const onMouseMove = (e) => {
    if (!downRef.current) return;
    e.preventDefault();
    updateSelection(startRef.current, e);
  };

  useEffect(() => {
    if (mouseDown) {
      // eslint-disable-next-line no-restricted-syntax
      const temp = new Set(selecting);
      selectableItems.forEach((value, key) => {
        const itemCoords = {
          left: value.current.offsetLeft,
          top: value.current.offsetTop,
          width: value.current.offsetWidth,
          height: value.current.offsetHeight,
        };
        if (intersects(itemCoords, selection)) {
          temp.add(key);
        } else temp.delete(key);
      });
      setSelecting(Array.from(temp));
      if (append == null && temp.size > 0) {
        const initValue = temp.values().next().value;
        setAppend(!selected.includes(initValue));
      }
    } else setTempSelecting(selecting);
  }, [selection]);

  // set final selected values
  useEffect(() => {
    const temp = new Set(selected);
    tempSelecting.forEach((item) => {
      if (append && !temp.has(item)) {
        temp.add(item);
      } else if (!append && temp.has(item)) temp.delete(item);
    });
    setSelected(Array.from(temp));
    setAppend(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempSelecting]);

  useEffect(() => {
    if (origSelected.length === 0 && selected.length === 0) return;
    const deselect = origSelected.filter((s) => !selected.includes(s));
    const select = selected.filter((s) => !origSelected.includes(s));
    changeAvailability(eventId, select, deselect).then((res) => {
      console.log('yay');
    }).catch((err) => console.log(err));
  }, [selected]);

  const onMouseUp = (e) => {
    if (downRef.current) {
      setDownRef(false);
      setSelection({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      });
      setSelecting([]);
      setStartRef(null);
      window.document.removeEventListener('mousemove', onMouseMove);
      window.document.removeEventListener('mouseup', onMouseUp);
    }
  };

  const onMouseDown = async (e) => {
    setDownRef(true);
    setStartRef({ x: e.pageX, y: e.pageY });
    updateSelection(startRef.current, e);
    window.document.addEventListener('mousemove', onMouseMove);
    window.document.addEventListener('mouseup', onMouseUp);
  };

  // const rows = [];
  // const earliest = Math.max(0, timeEarliest);
  // const range = (rangeStart, rangeStop, step) => Array.from(
  //   { length: (rangeStop - rangeStart) / step + 1 },
  //   (_, i) => `${rangeStart + (i * step)}:00`,
  // );
  // const hours = range(earliest, timeLatest, 1);
  // for (let i = 0; i < dates.length; i += 7) {
  //   const cols = [];
  //   for (let j = i; j < i + 7 && j < dates.length; j += 1) {
  //     const date = parseISO(dates[j]);
  //     const col = [];
  //     for (let h = earliest; h <= timeLatest; h += 1) {
  //       const r = createRef();
  //       const key = `${j}.${h}`;
  //       selectableItems.set(key, r);
  //       col.push({
  //         key,
  //         day: date,
  //         hour: h,
  //         ref: r,
  //       });
  //     }
  //     cols.push({ date, col });
  //   }
  //   rows.push(cols);
  // }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div id="select-container" onMouseDown={onMouseDown}>
        {/* {rows.map((row) => (
          <>
            <Row>
              <Col xs={1} />
              {row.map((col) => (
                <Col className="fw-bold text-secondary me-2">
                  <div className="d-flex justify-content-center align-items-center no-select">{format(col.date, 'ccc MM/dd')}</div>
                </Col>
              ))}
            </Row>
            <Row className="mb-5">
              <Col xs={1}>
                {hours.map((h) => (
                  <Row>
                    <ScheduleTime className="mt-1 d-flex justify-content-center align-items-center text-center w-100">
                      {h}
                    </ScheduleTime>
                  </Row>
                ))}
              </Col>
              {row.map((col) => (
                <Col className="me-2">
                  {col.col.map((time) => (
                    <Row>
                      <TimeSelectBlock
                        hour={time.hour}
                        key={time.key}
                        x={time.key}
                        innerRef={time.ref}
                        append={append}
                        selected={selected.includes(time.key)}
                        selecting={selecting.includes(time.key)}
                      />
                    </Row>
                  ))}
                </Col>
              ))}
            </Row>
          </>
        ))} */}
      </div>
      <SelectBox style={selection} />
    </>
  );
}
function AvailabilitySection({ dates, timeEarliest, timeLatest }) {
  const { eventId, readOnly } = useContext(EventContext);
  return (
    <div>
      <SectionTitle className="mt-5">Availability ⏰</SectionTitle>
      {!readOnly ? <Selector dates={dates} timeEarliest={timeEarliest} timeLatest={timeLatest} />
        : (<p>You must be a member of this event to select your availability.</p>)}
    </div>
  );
}

export default AvailabilitySection;
