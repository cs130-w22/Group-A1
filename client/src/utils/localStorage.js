import { useState, useCallback } from 'react';

const useLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  });

  const setStateWrapper = useCallback((value) => {
    try {
      // get new val or returned val
      const newValue = value instanceof Function ? value(state) : value;
      // persist to state and local storage
      const jsonValue = JSON.stringify(newValue);
      localStorage.setItem(key, jsonValue);
      setState(newValue);
    } catch (error) {
      console.log(error);
    }
  }, [key, setState]);

  return [state, setStateWrapper];
};

export default useLocalStorage;
