import { useEffect, useCallback } from 'react';
import { isValidMove, getNewPosition } from '../utils/mazeGenerator';

/**
 * Custom hook for handling keyboard navigation in the maze
 * @param {Object} maze - The maze object
 * @param {Object} position - Current position {x, y}
 * @param {Function} setPosition - Function to update position
 * @param {Function} incrementSteps - Function to increment steps counter
 * @param {boolean} gameActive - Whether the game is active
 * @returns {Object} - Object with arrowKeyHandlers
 */
const useKeyboardNavigation = (maze, position, setPosition, incrementSteps, gameActive) => {
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!gameActive) return;
    
    let direction;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        direction = 'up';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        direction = 'right';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        direction = 'down';
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        direction = 'left';
        break;
      default:
        return; // Not an arrow key
    }
    
    // Check if move is valid
    if (isValidMove(maze, position, direction)) {
      // Update position
      setPosition(getNewPosition(position, direction));
      // Increment steps
      incrementSteps();
    }
  }, [maze, position, setPosition, incrementSteps, gameActive]);
  
  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  // Handlers for touch/click controls
  const handleDirectionClick = (direction) => {
    if (!gameActive) return;
    
    if (isValidMove(maze, position, direction)) {
      setPosition(getNewPosition(position, direction));
      incrementSteps();
    }
  };
  
  return {
    handleDirectionClick
  };
};

export default useKeyboardNavigation;
