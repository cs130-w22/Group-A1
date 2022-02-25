import React, {useContext, useEffect, useRef, useState, createRef} from 'react';
import {Col, Row} from 'react-bootstrap';
import Selecto from 'selecto';
import styled from 'styled-components';
import {EventContext} from '../utils/context';
import {Schedule, ScheduleTime, SelectBox} from './styled/availability.styled';
import {SectionTitle} from './styled/headers';

function TimeSelectBlock({hour, selected, selecting, append, innerRef}) {
  const [selectedClass, setSelectedClass] = useState();
  useEffect(() => {
    if (append && (selecting || selected)) setSelectedClass('selected');
    else if (!append) {
      if (!selecting && selected) {
        setSelectedClass('selected');
      } else setSelectedClass('');
    } else setSelectedClass('');
  }, [selecting, selected, setSelectedClass]);
  return <Schedule ref={innerRef} className={`mt-2 ${selectedClass}`} />;
}

// referenced from https://github.com/pablofierro/react-drag-select/blob/master/lib/Selection.js
function intersects(a, b) {
  if (
    a.left <= b.left + b.width &&
    a.left + a.width >= b.left &&
    a.top <= b.top + b.height &&
    a.top + a.height >= b.top
  ) {
    return true;
  }
  return false;
}

function Selector({children}) {
  const [mouseDown, setMouseDown] = useState(false);
  const containerRef = createRef();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [append, setAppend] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selection, setSelection] = useState({});
  const [tempSelecting, setTempSelecting] = useState([]);
  const [selecting, setSelecting] = useState([]);
  const selectableItems = new Map();

  const blocks = [1, 2, 3];
  const days = 7;

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
  const setDownRef = data => {
    downRef.current = data;
    setMouseDown(data);
  };

  const startRef = React.useRef(start);
  const setStartRef = data => {
    startRef.current = data;
    setStart(data);
  };

  const endRef = React.useRef(end);
  const setEndRef = data => {
    endRef.current = data;
    setEnd(data);
  };

  const onMouseMove = e => {
    if (!downRef.current) return;
    e.preventDefault();
    setEndRef({x: e.pageX, y: e.pageY});
    const left = Math.min(startRef.current.x, e.pageX);
    const top = Math.min(startRef.current.y, e.pageY);
    const width = Math.abs(startRef.current.x - e.pageX);
    const height = Math.abs(startRef.current.y - e.pageY);
    setSelection({
      left,
      top,
      width,
      height,
    });
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
        // console.log(itemCoords);
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
    tempSelecting.forEach(item => {
      if (append && !temp.has(item)) {
        console.log('appending');
        temp.add(item);
      } else if (!append && temp.has(item)) temp.delete(item);
    });
    setSelected(Array.from(temp));
    setAppend(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempSelecting]);

  const disableSelect = e => e.preventDefault();

  const onMouseUp = e => {
    if (downRef.current) {
      setDownRef(false);
      setEndRef({x: e.pageX, y: e.pageY});
      setSelection({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      });
      setSelecting([]);
      setEndRef(null);
      setStartRef(null);
      window.document.removeEventListener('mousemove', onMouseMove);
      window.document.removeEventListener('mouseup', onMouseUp);
      window.document.removeEventListener('selectstart', disableSelect);
    }
  };

  const onMouseDown = async e => {
    // TODO check if already selected and setMode('append') otherwise
    setDownRef(true);
    setStartRef({x: e.pageX, y: e.pageY});
    setEndRef({x: e.pageX, y: e.pageY});
    updateSelection(startRef.current, e);
    window.document.addEventListener('mousemove', onMouseMove);
    window.document.addEventListener('mouseup', onMouseUp);
    window.document.addEventListener('selectstart', disableSelect);
  };

  const cols = [];
  const hours = Array.from(Array(24).keys());
  for (let i = 0; i < days; i += 1) {
    const col = [];

    console.log(hours);
    hours.forEach(h => {
      const r = createRef();
      const key = `${i}${h}`;
      selectableItems.set(key, r);
      col.push({
        key,
        day: i,
        hour: h,
        ref: r,
      });
    });
    cols.push(col);
  }

  useEffect(() => {
    if (append) console.log('Select mode');
    else if (append === false) console.log('Deselect mode');
  }, [append]);

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div id="select-container" ref={containerRef} onMouseDown={onMouseDown}>
        <Row>
          <Col xs={1} />
          {cols.map(col => (
            <Col>
              <div className="d-flex justify-content-center align-items-center me-2">Monday</div>
            </Col>
          ))}
        </Row>
        <Row>
          <Col xs={1}>
            {hours.map(h => (
              <Row>
                <ScheduleTime className="mt-2 d-flex justify-content-center align-items-center text-center w-100">
                  {h}
                </ScheduleTime>
              </Row>
            ))}
          </Col>
          {cols.map(col => (
            <Col>
              {col.map(time => (
                <Row>
                  <TimeSelectBlock
                    hour={time.hour}
                    key={time.key}
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
      </div>
      <SelectBox style={selection} />
    </>
  );
}
function AvailabilitySection() {
  const {eventId, readOnly} = useContext(EventContext);
  return (
    <div>
      <SectionTitle className="mt-5">Availability ⏰</SectionTitle>
      <p>Availability picker goes here</p>
      <Selector />
    </div>
  );
}

export default AvailabilitySection;
