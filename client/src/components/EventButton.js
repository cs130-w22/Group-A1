import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

export const overlayFunction = (readOnly) => (
  <Tooltip hidden={!readOnly || false}>
    <span>You aren&apos;t a member of this event!</span>
  </Tooltip>
);

export function EventButton({
  variant, style, className, onClick, readOnly, children, hidden,
}) {
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        overlayFunction(readOnly)
      }
    >
      <span>
        <Button
          variant={variant || 'outline-primary'}
          className={className || 'fw-bold'}
          tabIndex="-1"
          style={style || {}}
          onClick={onClick}
          disabled={readOnly || false}
          aria-disabled={readOnly || false}
          hidden={hidden || false}
        >
          {children}
        </Button>
      </span>
    </OverlayTrigger>
  );
}
