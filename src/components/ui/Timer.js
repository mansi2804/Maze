import React, { useState, useEffect, useRef, useCallback } from 'react';
import { usePrevious } from '../../hooks/usePrevious';

/**
 * Component for displaying and managing the game timer
 */
const Timer = React.memo(({ gameActive, onTimerUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  const onTimerUpdateRef = useRef(onTimerUpdate);
  const prevGameActive = usePrevious(gameActive);
  const secondsRef = useRef(0); // Keep a ref to the current seconds for reliable updates
  
  // Update the ref when onTimerUpdate changes
  useEffect(() => {
    onTimerUpdateRef.current = onTimerUpdate;
  }, [onTimerUpdate]);
  
  // Format seconds to mm:ss
  const formatTime = useCallback((totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Update parent with current time value on render
  useEffect(() => {
    if (seconds !== secondsRef.current) {
      secondsRef.current = seconds;
      // Make sure the parent knows the current time value
      onTimerUpdateRef.current?.(seconds);
      console.log(`Timer updated: ${seconds} seconds`);
    }
  }, [seconds]);
  
  // Update timer when gameActive changes
  useEffect(() => {
    // Only proceed if gameActive actually changed
    if (gameActive === prevGameActive) return;
    
    if (gameActive) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Start new interval with more precise timing
      let startTime = Date.now() - (seconds * 1000); // Account for existing seconds
      
      intervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        
        // Only update if the value has changed
        if (elapsedSeconds !== secondsRef.current) {
          setSeconds(elapsedSeconds);
          secondsRef.current = elapsedSeconds;
          onTimerUpdateRef.current?.(elapsedSeconds);
        }
      }, 100); // Update more frequently for accuracy
    } else {
      // When game becomes inactive (e.g. on win)
      // Make one final call to ensure the parent has the latest time
      if (seconds > 0) {
        onTimerUpdateRef.current?.(seconds);
        console.log(`Final timer value: ${seconds} seconds`);
      }
      
      // Clear interval when game is not active
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameActive, prevGameActive, seconds]);
  
  // Reset timer when game is reset
  useEffect(() => {
    if (!gameActive && prevGameActive && seconds !== 0) {
      // Ensure parent is notified of final time before reset
      onTimerUpdateRef.current?.(seconds);
      console.log(`Timer reset from ${seconds} to 0`);
      
      // Then reset the timer
      setSeconds(0);
      secondsRef.current = 0;
    }
  }, [gameActive, prevGameActive, seconds]);
  
  return (
    <div className="text-2xl font-bold text-gray-700">
      {formatTime(seconds)}
    </div>
  );
});

export default Timer;
