import { useRef, useEffect } from 'react';

/**
 * Custom hook that returns the previous value of a variable
 * @param {*} value - The value to track
 * @returns {*} The previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
};

export default usePrevious;
