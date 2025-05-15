import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { createAIPlayer } from '../utils/aiPlayer';

const MultiplayerContext = createContext();

// Helper function to calculate new position from move direction
const calculateNewPosition = (position, direction) => {
  const moves = {
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }
  };
  
  const move = moves[direction];
  if (!move) {
    console.error('Invalid direction:', direction);
    return { ...position }; // Return a copy of the current position if direction is invalid
  }
  
  return {
    x: position.x + move.x,
    y: position.y + move.y
  };
};

// Action types
const SET_GAME_MODE = 'SET_GAME_MODE';
const SET_AI_PLAYER = 'SET_AI_PLAYER';
const UPDATE_AI_POSITION = 'UPDATE_AI_POSITION';
const SET_AI_PATH = 'SET_AI_PATH';
const SET_AI_TAUNT = 'SET_AI_TAUNT';
const RESET_AI = 'RESET_AI';

// Game modes
export const GAME_MODES = {
  SINGLE_PLAYER: 'single',
  VS_AI: 'vs_ai',
  MULTIPLAYER: 'multiplayer'
};

const initialState = {
  gameMode: GAME_MODES.SINGLE_PLAYER,
  aiPlayer: null,
  aiPosition: null,
  aiPath: [],
  aiTaunt: null,
  aiProgress: 0,
  winner: null,
  raceStartTime: null,
  raceEndTime: null,
  leaderboard: []
};

function multiplayerReducer(state, action) {
  switch (action.type) {
    case SET_GAME_MODE:
      return { ...state, gameMode: action.payload };
    
    case SET_AI_PLAYER:
      return { ...state, aiPlayer: action.payload };
    
    case UPDATE_AI_POSITION:
      return { 
        ...state, 
        aiPosition: action.payload.position,
        aiProgress: action.payload.progress 
      };
    
    case SET_AI_PATH:
      return { ...state, aiPath: action.payload };
    
    case SET_AI_TAUNT:
      return { ...state, aiTaunt: action.payload };
    
    case RESET_AI:
      return { 
        ...state, 
        aiPosition: null, 
        aiPath: [],
        aiTaunt: null,
        aiProgress: 0,
        winner: null,
        raceStartTime: null,
        raceEndTime: null
      };
    
    default:
      return state;
  }
}

export const MultiplayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(multiplayerReducer, initialState);

  // Initialize AI player
  const initAIPlayer = useCallback((difficulty) => {
    const aiPlayer = createAIPlayer(difficulty);
    dispatch({ type: SET_AI_PLAYER, payload: aiPlayer });
    return aiPlayer;
  }, []);

  // Update AI position with better path handling
  const updateAIPosition = useCallback((mazeGrid, playerPosition, endPosition) => {
    if (!state.aiPlayer || !mazeGrid) {
      console.error('AI player not initialized or invalid maze grid');
      return null;
    }

    try {
      // Validate inputs
      if (!Array.isArray(mazeGrid) || mazeGrid.length === 0 || !Array.isArray(mazeGrid[0])) {
        throw new Error('Invalid maze grid structure');
      }

      if (!playerPosition || !endPosition) {
        throw new Error('Invalid player or end position');
      }

      // Static flag to prevent multiple simultaneous path calculations
      const currentPosition = state.aiPosition || playerPosition;
      
      // Check if we need to initialize or recalculate the path
      if (!state.aiPlayer.pathCalculated) {
        console.log('Initializing AI path calculation', { 
          start: currentPosition, 
          end: endPosition 
        });
        
        const pathCalculated = state.aiPlayer.updatePath(mazeGrid, currentPosition, endPosition);
        
        // If path calculation failed, try again from player position
        if (!pathCalculated && JSON.stringify(currentPosition) !== JSON.stringify(playerPosition)) {
          console.log('Retrying path calculation from player position');
          state.aiPlayer.updatePath(mazeGrid, playerPosition, endPosition);
        }
        
        // Generate a visualization path for display
        if (state.aiPlayer.path && state.aiPlayer.path.length > 0) {
          dispatch({ type: SET_AI_PATH, payload: [...state.aiPlayer.path] });
        }
      }
      
      // Get next move
      const move = state.aiPlayer.getNextMove();
      if (!move) {
        return null;
      }
      
      // Calculate new position based on the move
      const newPosition = calculateNewPosition(currentPosition, move);
      
      // Validate new position
      if (newPosition.x < 0 || newPosition.y < 0 || 
          newPosition.x >= mazeGrid[0].length || newPosition.y >= mazeGrid.length) {
        console.error('AI tried to move out of bounds, recalculating path');
        state.aiPlayer.updatePath(mazeGrid, currentPosition, endPosition);
        return null;
      }
      
      // Calculate progress
      const progress = state.aiPlayer.getProgress(mazeGrid, endPosition);
      
      // Update the AI position in state
      dispatch({ 
        type: UPDATE_AI_POSITION, 
        payload: { 
          position: newPosition, 
          progress: Math.min(100, Math.max(0, progress)) 
        } 
      });
      
      console.log('AI moving', { 
        from: currentPosition, 
        to: newPosition, 
        move, 
        progress: progress.toFixed(1) + '%' 
      });
      
      // Check if AI has reached the end
      if (newPosition.x === endPosition.x && newPosition.y === endPosition.y) {
        console.log('AI reached the end!');
        // Just log that AI reached the end, but don't trigger any win logic
        // The Game component will handle who won based on who reached first
      }
      
      // Occasionally get a taunt
      const taunt = state.aiPlayer.getTaunt();
      if (taunt) {
        dispatch({ type: SET_AI_TAUNT, payload: taunt });
        // Clear taunt after a few seconds
        setTimeout(() => {
          dispatch({ type: SET_AI_TAUNT, payload: null });
        }, 3000);
      }
      
      // Dispatch a custom event for the Game component to detect AI position
      window.dispatchEvent(new CustomEvent('ai-position-update', {
        detail: newPosition
      }));
      
      return newPosition;
    } catch (error) {
      console.error('Error updating AI position:', error);
      return null;
    }
  }, [state.aiPlayer, state.aiPosition]);

  // Reset AI state
  const resetAI = useCallback(() => {
    dispatch({ type: RESET_AI });
  }, []);

  // Set game mode
  const setGameMode = useCallback((mode) => {
    dispatch({ type: SET_GAME_MODE, payload: mode });
  }, []);


  return (
    <MultiplayerContext.Provider
      value={{
        ...state,
        initAIPlayer,
        updateAIPosition,
        resetAI,
        setGameMode,
        GAME_MODES
      }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
};

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};
