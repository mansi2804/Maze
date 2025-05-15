import React, { useState, useEffect, useCallback } from 'react';
import Cell from './Cell';
import { isAtEnd } from '../../utils/mazeGenerator';
import useKeyboardNavigation from '../../hooks/useKeyboardNavigation';

/**
 * Component for rendering the maze grid
 */
const Maze = ({
  maze,
  position,
  setPosition,
  gameActive,
  onWin,
  incrementSteps,
  cellSize = 30,
}) => {
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);

  const { handleDirectionClick } = useKeyboardNavigation(
    maze,
    position,
    setPosition,
    incrementSteps,
    gameActive
  );

  // Check if player has reached the end
  useEffect(() => {
    if (gameActive && isAtEnd(position, maze.end)) {
      onWin();
    }
  }, [position, maze.end, onWin, gameActive]);

  // Handle touch input
  const handleTouchStart = useCallback((e) => {
    if (!gameActive) return;
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  }, [gameActive]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault(); // Prevent scrolling
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!gameActive || !touchStartX || !touchStartY) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // Reset touch coordinates
    setTouchStartX(null);
    setTouchStartY(null);
    
    // Determine swipe direction if swipe is significant enough
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return; // Not a significant swipe
    }
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) {
        handleDirectionClick('right');
      } else {
        handleDirectionClick('left');
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        handleDirectionClick('down');
      } else {
        handleDirectionClick('up');
      }
    }
  }, [touchStartX, touchStartY, handleDirectionClick, gameActive]);

  // Calculate responsive cell size
  const getCellSize = () => {
    // Base size
    return cellSize;
  };

  const actualCellSize = getCellSize();
  
  return (
    <div
      className="relative bg-white shadow-lg rounded-xl p-4 md:p-6 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex flex-col items-center"
        style={{
          width: `${maze.width * actualCellSize}px`,
          height: `${maze.height * actualCellSize}px`,
        }}
      >
        {maze.grid.map((row, y) => (
          <div key={`row-${y}`} className="flex">
            {row.map((cell, x) => (
              <Cell
                key={`cell-${x}-${y}`}
                cell={cell}
                isPlayerPosition={position.x === x && position.y === y}
                isStartPosition={maze.start.x === x && maze.start.y === y}
                isEndPosition={maze.end.x === x && maze.end.y === y}
                size={actualCellSize}
              />
            ))}
          </div>
        ))}
      </div>
      
      {/* Mobile touch controls - only show on small screens */}
      <div className="md:hidden mt-6 flex flex-col items-center">
        <div className="grid grid-cols-3 gap-2 w-32">
          <div></div>
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex items-center justify-center"
            onClick={() => handleDirectionClick('up')}
            aria-label="Move up"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <div></div>
          
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex items-center justify-center"
            onClick={() => handleDirectionClick('left')}
            aria-label="Move left"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div></div>
          
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex items-center justify-center"
            onClick={() => handleDirectionClick('right')}
            aria-label="Move right"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <div></div>
          
          <button
            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2 flex items-center justify-center"
            onClick={() => handleDirectionClick('down')}
            aria-label="Move down"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Maze;
