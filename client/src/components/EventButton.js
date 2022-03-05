import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';

export const overlayFunction = (readOnly, archived) => (
  <Tooltip hidden={!readOnly || false}>
    {!archived && <span>You aren&apos;t a member of this event!</span>}
    {archived && <span>This event is archived!</span>}
  </Tooltip>
);

export function EventButton({
  variant,
  style,
  className,
  onClick,
  readOnly,
  children,
  hidden,
  archived,
}) {
  return (
    <OverlayTrigger
      placement="right"
      overlay={overlayFunction(readOnly, archived)}
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
