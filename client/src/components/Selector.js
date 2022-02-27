import { format, parse } from 'date-fns';
import React, {
  useContext, useEffect, useState, createRef,
} from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { changeAvailability, getAvailability } from '../api/event';
import { EventContext, UserContext } from '../utils/context';
import LoadingIndicator from './LoadingIndicator';
import { ScheduleTime, SelectBox } from './styled/availability.styled';
import TimeSelectBlock from './TimeSelectBlock';

// referenced from https://github.com/pablofierro/react-drag-select/blob/master/lib/Selection.js
function intersects(a, b) {
  if (a.left <= b.left + b.width
        && a.left + a.width >= b.left
        && a.top <= b.top + b.height
        && a.top + a.height >= b.top) {
    return true;
  }
  return false;
}
function Selector({ timeEarliest, timeLatest }) {
  const { eventId } = useContext(EventContext);
  const { user } = useContext(UserContext);

  // selector state
  const [mouseDown, setMouseDown] = useState(false);
  const [start, setStart] = useState();
  const [append, setAppend] = useState(null);

  // originally selected items
  // const [origSelected, setOrigSelected] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selection, setSelection] = useState({});
  const [tempSelecting, setTempSelecting] = useState(null);
  const [selecting, setSelecting] = useState(null);
  const [selectableItems, setSelectableItems] = useState(new Map());

  // rendered blocks
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const createTimeBlock = ({ _id, hour, userList }) => {
    const r = createRef();
    setSelectableItems(new Map(selectableItems.set(_id, r)));
    return {
      _id,
      hour,
      users: userList,
      ref: r,
    };
  };
  const createDayBlock = ({ day, times }) => {
    const timeblocks = [];
    const date = (parse(day, 'D', new Date(), { useAdditionalDayOfYearTokens: true }));
    const sortedTimes = times.sort((a, b) => a.hour - b.hour);
    const selectedData = [];
    sortedTimes.forEach((time) => {
      timeblocks.push(createTimeBlock(time));
      if (time.userList.find((u) => u._id === user.userId)) {
        selectedData.push(time._id);
      }
    });
    return {
      selectedData,
      block: {
        date,
        timeblocks,
      },
    };
  };
  // get original availability
  useEffect(() => {
    console.log('Grabbing original data');
    setLoading(true);
    getAvailability(eventId, user.userId).then((res) => {
      let days = [];
      const selectedData = [];
      res.data.forEach((day) => {
        const d = createDayBlock(day);
        selectedData.push(...d.selectedData);
        days.push(d.block);
      });
      setSelected(selectedData);
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
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!downRef.current) { return; }
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
        } else { temp.delete(key); }
      });
      setSelecting(Array.from(temp));
      if (append == null && temp.size > 0) {
        const initValue = temp.values().next().value;
        setAppend(!selected.includes(initValue));
      }
    } else if (selecting !== null) {
      setTempSelecting(selecting);
    }
  }, [selection, mouseDown, selectableItems, selected, selecting, append]);

  // set final selected values
  useEffect(() => {
    if (tempSelecting == null || (selected.length === 0 && tempSelecting.length === 0)) { return; }
    const temp = new Set(selected);
    tempSelecting.forEach((item) => {
      if (append && !temp.has(item)) {
        temp.add(item);
      } else if (!append && temp.has(item)) { temp.delete(item); }
    });
    const deselect = selected.filter((s) => !temp.has(s));
    const selectedArray = Array.from(temp);
    const select = selectedArray.filter((s) => !selected.includes(s));
    setSelected(selectedArray);
    setAppend(null);
    if (select.length > 0 || deselect.length > 0) {
      changeAvailability(eventId, select, deselect).then(() => {
      }).catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempSelecting]);

  const onMouseUp = () => {
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

  // TODO move this together
  const earliest = Math.max(0, timeEarliest);
  const range = (rangeStart, rangeStop, step) => Array.from(
    { length: (rangeStop - rangeStart) / step + 1 },
    (_, i) => `${rangeStart + (i * step)}:00`,
  );
  const hours = range(earliest, timeLatest, 1);

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && rows.length > 0 && (
      <div>
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div id="select-container" onMouseDown={onMouseDown}>
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
                    <TimeSelectBlock
                      hour={block.hour}
                      key={block._id}
                      innerRef={block.ref}
                      append={append}
                      selected={selected.includes(block._id)}
                      selecting={selecting?.includes(block._id) || false}
                    />
                  ))}
                </Col>
              ))}
            </Row>
          ))}
        </div>
        <SelectBox style={selection} />
      </div>
      )}
    </>
  );
}

Selector.propTypes = {
  timeEarliest: PropTypes.number.isRequired,
  timeLatest: PropTypes.number.isRequired,
};

export default Selector;
