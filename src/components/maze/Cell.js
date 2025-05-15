import React from 'react';

/**
 * Component for rendering a single cell in the maze
 */
const Cell = ({ cell, isPlayerPosition, isStartPosition, isEndPosition, size }) => {
  // Determine cell styling based on walls and position
  const cellStyle = {
    width: `${size}px`,
    height: `${size}px`,
    position: 'relative',
    boxSizing: 'border-box',
    borderTop: cell.walls.top ? '2px solid #333' : 'none',
    borderRight: cell.walls.right ? '2px solid #333' : 'none',
    borderBottom: cell.walls.bottom ? '2px solid #333' : 'none',
    borderLeft: cell.walls.left ? '2px solid #333' : 'none',
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease',
  };

  // Start position styling
  if (isStartPosition) {
    cellStyle.backgroundColor = 'rgba(108, 99, 255, 0.2)'; // Primary color with transparency
  }
  
  // End position styling
  if (isEndPosition) {
    cellStyle.backgroundColor = 'rgba(67, 233, 123, 0.2)'; // Accent color with transparency
  }

  return (
    <div className="relative" style={cellStyle}>
      {isPlayerPosition && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="rounded-full bg-primary animate-pulse-slow" 
            style={{ width: `${size * 0.7}px`, height: `${size * 0.7}px` }}
          />
        </div>
      )}
      {isEndPosition && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="rounded-full border-2 border-accent" 
            style={{ width: `${size * 0.8}px`, height: `${size * 0.8}px` }}
          />
        </div>
      )}
    </div>
  );
};

export default Cell;
