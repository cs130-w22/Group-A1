import React from 'react';
  import { Watch } from 'react-loader-spinner';

  function LoadingIndicator() {
      return (<Watch heigth="100" width="100" color="grey" ariaLabel="loading" />);
  }

  export default LoadingIndicator;