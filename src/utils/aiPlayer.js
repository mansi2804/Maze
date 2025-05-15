// A* pathfinding algorithm
const findPath = (maze, start, end) => {
  if (!maze || !start || !end) {
    console.error('Invalid arguments for findPath');
    return [];
  }

  try {
    const openSet = [start];
    const closedSet = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();
    
    // Initialize scores
    gScore.set(`${start.x},${start.y}`, 0);
    fScore.set(`${start.x},${start.y}`, heuristic(start, end));

    // Safety limit to prevent infinite loops
    let iterations = 0;
    const maxIterations = maze.length * maze[0].length * 2;

    while (openSet.length > 0 && iterations < maxIterations) {
      iterations++;

      // Get node with lowest fScore
      openSet.sort((a, b) => 
        (fScore.get(`${a.x},${a.y}`) || Infinity) - (fScore.get(`${b.x},${b.y}`) || Infinity)
      );
      
      const current = openSet.shift();
      const currentKey = `${current.x},${current.y}`;
      
      // Add to closed set
      closedSet.add(currentKey);
      
      // Check if we've reached the end
      if (current.x === end.x && current.y === end.y) {
        return reconstructPath(cameFrom, current);
      }
      
      // Check all neighbors
      const neighbors = getValidNeighbors(maze, current.x, current.y);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.x},${neighbor.y}`;
        
        // Skip if in closed set
        if (closedSet.has(neighborKey)) continue;
        
        const tentativeGScore = (gScore.get(currentKey) || 0) + 1;
        
        // If not in open set, add it
        const inOpenSet = openSet.some(n => n.x === neighbor.x && n.y === neighbor.y);
        if (!inOpenSet) {
          openSet.push(neighbor);
        } else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
          // If already in open set but this path isn't better, skip
          continue;
        }
        
        // This is the best path so far, record it
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));
      }
    }
    
    if (iterations >= maxIterations) {
      console.warn('AI pathfinding reached iteration limit');
    }
    
    return []; // No path found
  } catch (error) {
    console.error('Error in AI pathfinding:', error);
    return [];
  }
};

// Simple Manhattan distance heuristic function
const heuristic = (a, b) => {
  // Manhattan distance
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

// Get valid neighboring cells for pathfinding
const getValidNeighbors = (maze, x, y) => {
  if (!maze || x === undefined || y === undefined) {
    return [];
  }

  const neighbors = [];
  const directions = [
    { dx: 0, dy: -1 }, // Up
    { dx: 1, dy: 0 },  // Right
    { dx: 0, dy: 1 },  // Down
    { dx: -1, dy: 0 }  // Left
  ];

  for (const { dx, dy } of directions) {
    const nx = x + dx;
    const ny = y + dy;

    // Check if the neighbor is within bounds
    if (nx >= 0 && nx < maze[0].length && ny >= 0 && ny < maze.length) {
      const cell = maze[y][x];

      // Check if there's a wall in this direction
      let canMove = false;

      if (dx === 1 && !cell.walls.right) canMove = true;
      else if (dx === -1 && !cell.walls.left) canMove = true;
      else if (dy === 1 && !cell.walls.bottom) canMove = true;
      else if (dy === -1 && !cell.walls.top) canMove = true;

      if (canMove) {
        neighbors.push({ x: nx, y: ny });
      }
    }
  }

  return neighbors;
};

// Reconstruct path from the cameFrom map
const reconstructPath = (cameFrom, current) => {
  const path = [current];
  while (cameFrom.has(`${current.x},${current.y}`)) {
    current = cameFrom.get(`${current.x},${current.y}`);
    path.unshift(current);
  }
  return path;
};

export class AIPlayer {
  constructor(difficulty = 'medium') {
    this.difficulty = difficulty;
    this.path = [];
    this.currentStep = 0;
    this.pathCalculated = false;
    this.pathCalculating = false;
    this.lastPathError = null;
    this.taunts = [
      "I'm on my way!",
      "Catch me if you can!",
      "Almost there!",
      "This is too easy!",
      "Try to keep up!",
      "I see the exit!"
    ];
    this.lastTauntTime = 0;
    this.tauntCooldown = 10000; // 10 seconds
    this.lastMoveTime = 0;
    this.moveDelay = 300; // ms between moves based on difficulty
  }

  /**
   * Update the AI's path to the target
   * @param {Array} maze - The maze grid
   * @param {Object} start - Start position {x, y}
   * @param {Object} end - End position {x, y}
   * @returns {boolean} - Whether the path was successfully calculated
   */
  updatePath(maze, start, end) {
    if (this.pathCalculating) {
      console.log('Path calculation already in progress');
      return false;
    }

    try {
      // Validate inputs
      if (!maze || !start || !end || !Array.isArray(maze) || maze.length === 0) {
        this.lastPathError = 'Invalid maze structure or positions';
        console.error('Invalid inputs for AI path calculation:', { maze, start, end });
        return false;
      }

      this.pathCalculating = true;
      const timeStart = performance.now();
      
      // Calculate the path
      const path = findPath(maze, start, end);
      
      const timeEnd = performance.now();
      console.log(`AI path calculation took ${(timeEnd - timeStart).toFixed(2)}ms`);
      
      this.path = path;
      this.currentStep = 0;
      this.pathCalculated = path.length > 0;
      this.pathCalculating = false;
      this.lastPathError = null;
      
      // Adjust move delay based on difficulty and path length
      if (this.difficulty === 'easy') {
        this.moveDelay = 500; // Slower for easy
      } else if (this.difficulty === 'hard') {
        this.moveDelay = 200; // Faster for hard
      } else {
        this.moveDelay = 300; // Medium
      }
      
      return this.pathCalculated;
    } catch (error) {
      this.pathCalculating = false;
      this.lastPathError = error.message;
      console.error('Error calculating AI path:', error);
      return false;
    }
  }

  /**
   * Get the next move for the AI
   * @returns {string|null} - Direction to move ('up', 'right', 'down', 'left') or null if no move
   */
  getNextMove() {
    const now = Date.now();
    
    // Rate limit moves to prevent lag
    if (now - this.lastMoveTime < this.moveDelay) {
      return null; // Not time for a move yet
    }
    
    if (!this.pathCalculated || this.currentStep >= this.path.length - 1) {
      return null; // No path or reached the end
    }
    
    try {
      const current = this.path[this.currentStep];
      const next = this.path[this.currentStep + 1];
      
      if (!current || !next) {
        return null;
      }
      
      this.currentStep++;
      this.lastMoveTime = now;
      
      // Determine direction
      if (next.x > current.x) return 'right';
      if (next.x < current.x) return 'left';
      if (next.y > current.y) return 'down';
      if (next.y < current.y) return 'up';
      
      return null;
    } catch (error) {
      console.error('Error getting AI next move:', error);
      return null;
    }
  }

  /**
   * Get a random taunt message based on cooldown and probability
   * @returns {string|null} - Taunt message or null
   */
  getTaunt() {
    const now = Date.now();
    if (now - this.lastTauntTime > this.tauntCooldown && Math.random() > 0.7) {
      this.lastTauntTime = now;
      return this.taunts[Math.floor(Math.random() * this.taunts.length)];
    }
    return null;
  }

  /**
   * Calculate the progress of the AI towards the goal
   * @param {Array} maze - The maze grid
   * @param {Object} endPosition - End position {x, y}
   * @returns {number} - Progress percentage (0-100)
   */
  getProgress(maze, endPosition) {
    if (!maze || !endPosition || !this.pathCalculated) {
      return 0;
    }
    
    try {
      // Calculate progress based on remaining steps
      if (this.path.length === 0) return 0;
      
      // Calculate progress based on completion percentage of the path
      const completionPercent = (this.currentStep / Math.max(1, this.path.length - 1)) * 100;
      
      return Math.min(100, Math.round(completionPercent));
    } catch (error) {
      console.error('Error calculating AI progress:', error);
      return 0;
    }
  }
}

export const createAIPlayer = (difficulty) => new AIPlayer(difficulty);
