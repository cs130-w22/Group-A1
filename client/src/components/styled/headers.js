import React from 'react';
import PropTypes from 'prop-types';

export function SectionTitle({ children, className }) {
  return <h3 className={`fs-4 fw-bold ${className}`}>{children}</h3>;
}

export function CategoryTitle({ children, count }) {
  return (
    <h4 className="fs-6 fw-bold text-secondary text-uppercase">
      {children}
      {' '}
      -
      {' '}
      {count}
    </h4>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.string.isRequired,
  className: PropTypes.string,
};

SectionTitle.defaultProps = {
  className: '',
};

CategoryTitle.propTypes = {
  children: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};
