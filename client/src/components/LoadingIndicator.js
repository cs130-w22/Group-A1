import React from 'react';
  import { Watch } from 'react-loader-spinner';

/**
 * Returns LoadingIndicator component
 * @returns {JSX.Element} formatted loading visual
 * @constructor
 */
function LoadingIndicator() {
      return (<Watch heigth="100" width="100" color="grey" ariaLabel="loading" />);
  }

  export default LoadingIndicator;