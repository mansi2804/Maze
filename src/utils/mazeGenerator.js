/**
 * Maze Generator using Recursive Backtracking algorithm
 * 
 * Difficulty levels affect:
 * - Size of the maze (easy: smaller, hard: larger)
 * - Number of dead ends and complexity
 */

// Directions for maze traversal
const DIRECTIONS = [
  [0, -1], // Up
  [1, 0],  // Right
  [0, 1],  // Down
  [-1, 0]  // Left
];

// Difficulty presets
const DIFFICULTY_SETTINGS = {
  easy: {
    width: 9,
    height: 9,
    complexity: 0.3
  },
  medium: {
    width: 15,
    height: 15,
    complexity: 0.5
  },
  hard: {
    width: 21,
    height: 21,
    complexity: 0.8
  }
};

/**
 * Generate a random maze using recursive backtracking
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @returns {Object} - Maze object with cells, start, end, and dimensions
 */
export const generateMaze = (difficulty = 'medium') => {
  try {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    if (!settings) {
      throw new Error(`Invalid difficulty level: ${difficulty}`);
    }
    
    const { width, height, complexity } = settings;
    if (width < 3 || height < 3) {
      throw new Error('Maze dimensions must be at least 3x3');
    }
    
    // Initialize grid with walls
    const grid = Array(height).fill().map(() => 
      Array(width).fill().map(() => ({
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true }
      }))
    );
    
    // Random start position (always on an edge)
    const startSide = Math.floor(Math.random() * 4);
    let startX, startY;
    
    switch (startSide) {
      case 0: // Top edge
        startX = Math.floor(Math.random() * width);
        startY = 0;
        break;
      case 1: // Right edge
        startX = width - 1;
        startY = Math.floor(Math.random() * height);
        break;
      case 2: // Bottom edge
        startX = Math.floor(Math.random() * width);
        startY = height - 1;
        break;
      case 3: // Left edge
        startX = 0;
        startY = Math.floor(Math.random() * height);
        break;
      default:
        throw new Error('Invalid start side');
    }
    
    // Carve passages through the maze using recursive backtracking
    const carvePassages = (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height || grid[y][x].visited) {
        return false;
      }
      
      grid[y][x].visited = true;
      
      // Shuffle directions to ensure randomness
      const shuffledDirections = [...DIRECTIONS]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      
      // Try each direction
      let anyCarved = false;
      for (const [dx, dy] of shuffledDirections) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !grid[ny][nx].visited) {
          // Remove walls between current cell and next cell
          if (dx === 1) { // Moving right
            grid[y][x].walls.right = false;
            grid[ny][nx].walls.left = false;
          } else if (dx === -1) { // Moving left
            grid[y][x].walls.left = false;
            grid[ny][nx].walls.right = false;
          } else if (dy === 1) { // Moving down
            grid[y][x].walls.bottom = false;
            grid[ny][nx].walls.top = false;
          } else if (dy === -1) { // Moving up
            grid[y][x].walls.top = false;
            grid[ny][nx].walls.bottom = false;
          }
          
          if (carvePassages(nx, ny)) {
            anyCarved = true;
          }
        }
      }
      
      return anyCarved;
    };
    
    // Start carving from the start position
    carvePassages(startX, startY);
    
    // Add extra paths based on complexity
    const addExtraPaths = () => {
      const numExtraPaths = Math.floor(width * height * (1 - complexity) * 0.1);
      
      for (let i = 0; i < numExtraPaths; i++) {
        const x = Math.floor(Math.random() * (width - 1));
        const y = Math.floor(Math.random() * (height - 1));
        
        if (x >= 0 && x < width - 1 && y >= 0 && y < height - 1) {
          // Randomly remove a wall to create a loop
          const removeHorizontal = Math.random() > 0.5;
          
          if (removeHorizontal && y < height - 1) {
            grid[y][x].walls.bottom = false;
            grid[y + 1][x].walls.top = false;
          } else if (x < width - 1) {
            grid[y][x].walls.right = false;
            grid[y][x + 1].walls.left = false;
          }
        }
      }
    };
    
    addExtraPaths();
    
    // Find the furthest point from start for the end position
    let endX = startX;
    let endY = startY;
    let maxDistance = 0;
    
    // Check all cells to find the furthest point
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x].visited) {
          const distance = Math.hypot(x - startX, y - startY);
          if (distance > maxDistance) {
            maxDistance = distance;
            endX = x;
            endY = y;
          }
        }
      }
    }

    // Helper function: Check if a path exists between two points
    const isPathPossible = (grid, start, end) => {
      const visited = new Set();
      const queue = [start];
      
      while (queue.length > 0) {
        const { x, y } = queue.shift();
        const key = `${x},${y}`;
        
        if (visited.has(key)) continue;
        visited.add(key);
        
        if (x === end.x && y === end.y) return true;
        
        // Check all directions
        for (const [dx, dy] of DIRECTIONS) {
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
            const currentCell = grid[y][x];
            
            // Check if we can move in this direction
            if (dx === 1 && !currentCell.walls.right) {
              queue.push({ x: nx, y: ny });
            } else if (dx === -1 && !currentCell.walls.left) {
              queue.push({ x: nx, y: ny });
            } else if (dy === 1 && !currentCell.walls.bottom) {
              queue.push({ x: nx, y: ny });
            } else if (dy === -1 && !currentCell.walls.top) {
              queue.push({ x: nx, y: ny });
            }
          }
        }
      }
      
      return false;
    };

    // Helper function: Create a simple path between two points
    const createFallbackPath = (grid, start, end) => {
      const path = [];
      let current = { ...start };
      
      // Move horizontally first
      while (current.x !== end.x) {
        const dx = current.x < end.x ? 1 : -1;
        const next = { x: current.x + dx, y: current.y };
        path.push(next);
        current = next;
      }
      
      // Then move vertically
      while (current.y !== end.y) {
        const dy = current.y < end.y ? 1 : -1;
        const next = { x: current.x, y: current.y + dy };
        path.push(next);
        current = next;
      }
      
      // Create path by removing walls
      for (let i = 0; i < path.length - 1; i++) {
        const current = path[i];
        const next = path[i + 1];
        
        if (next.x > current.x) {
          grid[current.y][current.x].walls.right = false;
          grid[next.y][next.x].walls.left = false;
        } else if (next.x < current.x) {
          grid[current.y][current.x].walls.left = false;
          grid[next.y][next.x].walls.right = false;
        } else if (next.y > current.y) {
          grid[current.y][current.x].walls.bottom = false;
          grid[next.y][next.x].walls.top = false;
        } else if (next.y < current.y) {
          grid[current.y][current.x].walls.top = false;
          grid[next.y][next.x].walls.bottom = false;
        }
      }
    };

    // Ensure there's a path from start to end
    if (!isPathPossible(grid, { x: startX, y: startY }, { x: endX, y: endY })) {
      console.warn('Creating fallback path between start and end');
      createFallbackPath(grid, { x: startX, y: startY }, { x: endX, y: endY });
    }

    return {
      grid,
      start: { x: startX, y: startY },
      end: { x: endX, y: endY },
      width,
      height
    };
  } catch (error) {
    console.error('Error generating maze:', error);
    throw error;
  }
};

/**
 * Check if a move is valid in the maze
 * @param {Object} maze - The maze object
 * @param {Object} position - Current position {x, y}
 * @param {string} direction - 'up', 'right', 'down', 'left'
 * @returns {boolean} - Whether the move is valid
 */
export const isValidMove = (maze, position, direction) => {
  if (!maze || !position) return false;
  
  const { grid } = maze;
  const { x, y } = position;
  
  // Check if position is within bounds
  if (x < 0 || x >= maze.width || y < 0 || y >= maze.height) {
    return false;
  }
  
  // Check if there's a wall in the requested direction
  const cell = grid[y][x];
  
  switch (direction) {
    case 'up':
      return !cell.walls.top;
    case 'right':
      return !cell.walls.right;
    case 'down':
      return !cell.walls.bottom;
    case 'left':
      return !cell.walls.left;
    default:
      return false;
  }
};

/**
 * Get the new position after a move
 * @param {Object} position - Current position {x, y}
 * @param {string} direction - 'up', 'right', 'down', 'left'
 * @returns {Object} - New position {x, y}
 */
export const getNewPosition = (position, direction) => {
  if (!position) return { x: 0, y: 0 };
  
  const { x, y } = position;
  
  switch (direction) {
    case 'up':
      return { x, y: y - 1 };
    case 'right':
      return { x: x + 1, y };
    case 'down':
      return { x, y: y + 1 };
    case 'left':
      return { x: x - 1, y };
    default:
      return { x, y };
  }
};

/**
 * Get all valid neighboring cells for pathfinding
 * @param {Array} maze - The maze grid
 * @param {number} x - Current x position
 * @param {number} y - Current y position
 * @returns {Array} - Array of valid neighbor positions
 */
export const getNeighbors = (maze, x, y) => {
  if (!maze || x === undefined || y === undefined) {
    return [];
  }
  
  try {
    const neighbors = [];
    const directions = [
      { dx: 0, dy: -1, direction: 'up' },     // Up
      { dx: 1, dy: 0, direction: 'right' },    // Right
      { dx: 0, dy: 1, direction: 'down' },     // Down
      { dx: -1, dy: 0, direction: 'left' }     // Left
    ];
    
    for (const { dx, dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      // Check if the position is within bounds
      if (nx >= 0 && nx < maze[0].length && ny >= 0 && ny < maze.length) {
        // Check if there's a wall between current cell and neighbor
        if (isMoveValid(maze, x, y, nx, ny)) {
          neighbors.push({ x: nx, y: ny });
        }
      }
    }
    
    return neighbors;
  } catch (error) {
    console.error('Error getting neighbors:', error);
    return [];
  }
};

/**
 * Check if a move is valid in the maze (for AI pathfinding)
 * @param {Array} maze - The maze grid
 * @param {number} x - Current x position
 * @param {number} y - Current y position
 * @param {number} nx - New x position
 * @param {number} ny - New y position
 * @returns {boolean} - Whether the move is valid
 */
export const isMoveValid = (maze, x, y, nx, ny) => {
  if (!maze || !maze[y] || !maze[y][x] || !maze[ny] || !maze[ny][nx]) {
    return false;
  }
  
  const currentCell = maze[y][x];
  
  // Moving right
  if (nx > x) {
    return !currentCell.walls.right;
  }
  // Moving left
  if (nx < x) {
    return !currentCell.walls.left;
  }
  // Moving down
  if (ny > y) {
    return !currentCell.walls.bottom;
  }
  // Moving up
  if (ny < y) {
    return !currentCell.walls.top;
  }
  
  return false;
};

/**
 * Check if the current position is the end position
 * @param {Object} position - Current position {x, y}
 * @param {Object} end - End position {x, y}
 * @returns {boolean} - Whether the current position is the end
 */
export const isAtEnd = (position, end) => {
  if (!position || !end) return false;
  return position.x === end.x && position.y === end.y;
};
