import React, { useContext, useEffect, useRef, useState } from 'react';
import Selecto from 'selecto';
import styled from 'styled-components';
import { EventContext } from '../utils/context';
import { SectionTitle } from './styled/headers';

const Schedule = styled.div`
  height: 50px;
  width: 100px;
  background-color: #76a5af;
`;
function SelecterBlock({ hour, selected }) {
  return <Schedule className="mt-2" />;
}

const Selecty = styled.div`
  background: rgba(0, 162, 255, 0.4);
  position: absolute;
  z-index: 99;
`;

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

function Selector({ children }) {
  const [mouseDown, setMouseDown] = useState(false);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [selected, setSelected] = useState([]);
  const [coords, setCoords] = useState({});
  const [selection, setSelection] = useState({});
  // const selectableItems = useRef([]);

  // useEffect(() => {
  //   const container = document.getElementById('select-container');
  //   if (container) {
  //     Array.from(container.childNodes).forEach((item) => {
  //       const {
  //         left, top, width, height,
  //       } = item.getBoundingClientRect();
  //       console.log(item);
  //       selectableItems.current.push({
  //         left,
  //         top,
  //         width,
  //         height,
  //       });
  //     });
  //   }
  // }, []);

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

  const endRef = React.useRef(end);
  const setEndRef = (data) => {
    endRef.current = data;
    setEnd(data);
  };

  useEffect(() => {
    const node = document.getElementById('select-container');
    const rect = node.getBoundingClientRect();
    setCoords({
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
    });
    console.log(coords);
  }, []);

  const onMouseMove = (e) => {
    if (!downRef.current) return;
    e.preventDefault();
    setEndRef({ x: e.pageX, y: e.pageY });
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
      for (let i = 0; i < children.length; i += 1) {
        console.log(children[i]);
      }
    }
  }, [selection]);

  useEffect(() => {
    console.log(mouseDown);
  }, [mouseDown]);

  const disableSelect = (e) => e.preventDefault();

  const onMouseUp = (e) => {
    if (mouseDown) setEndRef({ x: e.pageX, y: e.pageY });
    setSelection({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });
    setDownRef(false);
    setEndRef(null);
    setStartRef(null);
    window.document.removeEventListener('mousemove', onMouseMove);
    window.document.removeEventListener('mouseup', onMouseUp);
    window.document.removeEventListener('selectstart', disableSelect);
  };

  const onMouseDown = (e) => {
    console.log('down');
    setDownRef(true);
    setStartRef({ x: e.pageX, y: e.pageY });
    window.document.addEventListener('mousemove', onMouseMove);
    window.document.addEventListener('mouseup', onMouseUp);
    window.document.addEventListener('selectstart', disableSelect);
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div id="select-container" onMouseDown={onMouseDown}>
        {children}
      </div>
      <Selecty style={selection} />
    </>
  );
}
function AvailabilitySection() {
  const { eventId, readOnly } = useContext(EventContext);
  return (
    <div>
      <SectionTitle className="mt-5">Availability ⏰</SectionTitle>
      <p>Availability picker goes here</p>
      <Selector>
        <SelecterBlock hour={1} />
        <SelecterBlock hour={1} />
        <SelecterBlock hour={1} />
      </Selector>
    </div>
  );
}

function TimeBlock() {}

// /**
//  * Detect 2D box intersection
//  */
// _boxIntersects: function(boxA, boxB) {
//   if (boxA.left <= boxB.left + boxB.width &&
//     boxA.left + boxA.width >= boxB.left &&
//     boxA.top <= boxB.top + boxB.height &&
//     boxA.top + boxA.height >= boxB.top) {
//     return true;
//   }
//   return false;
// },

// /**
//  * Updates the selected items based on the
//  * collisions with selectionBox
//  */
// _updateCollidingChildren: function(selectionBox) {
//   var tmpNode = null;
//   var tmpBox = null;
//   var _this = this;
//   _.each(this.refs, function (ref, key) {
//     if (key !== 'selectionBox') {
//       tmpNode = React.findDOMNode(ref);
//       tmpBox = {
//         top: tmpNode.offsetTop,
//         left: tmpNode.offsetLeft,
//         width: tmpNode.clientWidth,
//         height: tmpNode.clientHeight
//       };
//       if (_this._boxIntersects(selectionBox, tmpBox)) {
//         _this.selectedChildren[key] = true;
//       }
//       else {
//         if (!_this.state.appendMode) {
//           delete _this.selectedChildren[key];
//         }
//       }
//     }
//   });
// },
export default AvailabilitySection;
