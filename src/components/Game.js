import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateMaze } from '../utils/mazeGenerator';
import { useMultiplayer } from '../context/MultiplayerContext';
import Maze from './maze/Maze';
import GameStats from './ui/GameStats';
import WinScreen from './ui/WinScreen';
import Timer from './ui/Timer';
import { 
  ArrowPathIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import { playMoveSound, playWinSound } from '../utils/sounds';
import Button from './ui/Button';

const Game = ({ gameMode, onBackToMenu, difficulty, onDifficultyChange }) => {
  // Game state
  const [maze, setMaze] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const timeRef = useRef(0); // Reference to current time for reliable access
  const startTimeRef = useRef(0); // To track when the game started
  const timerIntervalRef = useRef(null); // Timer interval reference
  const [gameActive, setGameActive] = useState(false);
  const [gameWon, setGameWon] = useState(false); 
  const [showAIPath, setShowAIPath] = useState(false);
  const gameStateRef = useRef({ gameActive: false, gameWon: false });
  const [finalTime, setFinalTime] = useState(0); // To store the final time when game ends
  
  // Multiplayer context
  const { 
    aiPosition, 
    aiPath, 
    aiTaunt, 
    aiProgress,
    updateAIPosition,
    initAIPlayer,
    resetAI,
    GAME_MODES: modes
  } = useMultiplayer();
  
  const aiMoveInterval = useRef(null);

  // Update game state ref when state changes
  useEffect(() => {
    gameStateRef.current = { gameActive, gameWon };
  }, [gameActive, gameWon]);

  // Store stable references to prevent unnecessary re-renders
  const mazeRef = useRef(null);
  const updateAIPositionRef = useRef(null);
  const gameStateStableRef = useRef({ 
    gameMode: null,
    playerWon: false,
    aiWon: false
  });
  const aiIntervalIdRef = useRef(null);
  const hasInitializedAI = useRef(false);
  const aiPositionRef = useRef(null);
  
  // Direct timer implementation
  useEffect(() => {
    if (gameActive && !gameWon) {
      // Clear any existing timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      
      // Record start time if not already set
      if (startTimeRef.current === 0) {
        startTimeRef.current = Date.now();
        console.log('Timer started at:', new Date(startTimeRef.current));
      }
      
      // Create a new timer that updates every 100ms
      timerIntervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
        timeRef.current = elapsedSeconds;
        setTime(elapsedSeconds);
      }, 100);
      
      // Clean up on unmount or when game becomes inactive
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    } else if (!gameActive && timerIntervalRef.current) {
      // Game is no longer active, clear the timer
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [gameActive, gameWon]);

  // Handle winning the game (defined early to avoid reference errors)
  const handleWin = useCallback((playerWon = true) => {
    if (gameWon) return; // Prevent double wins
    
    // Stop the timer and capture final time
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Calculate final time directly to ensure accuracy
    const finalSeconds = startTimeRef.current ? Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000)) : 1;
    
    console.log(`Game won! Final time: ${finalSeconds} seconds`);
    setFinalTime(finalSeconds); // Save to state for the win screen
    
    // Now update state
    setGameActive(false);
    setGameWon(true);
    
    // Stop AI movement
    if (aiIntervalIdRef.current) {
      clearInterval(aiIntervalIdRef.current);
      aiIntervalIdRef.current = null;
    }
    
    // Only play win sound if player won
    if (playerWon) {
      playWinSound();
    }
    
    gameStateStableRef.current.playerWon = playerWon;
    
    console.log(`${playerWon ? 'Player' : 'AI'} won the game with time: ${finalSeconds} seconds!`);
  }, [gameWon]);

  // Update stable references when dependencies change
  useEffect(() => {
    if (maze) mazeRef.current = maze;
    updateAIPositionRef.current = updateAIPosition;
    gameStateStableRef.current.gameMode = gameMode;
  }, [maze, updateAIPosition, gameMode]);

  // Track AI position for win detection
  useEffect(() => {
    // Set up a listener for AI position updates
    const handleAIPositionUpdate = (event) => {
      if (!event.detail || !maze) return;
      
      aiPositionRef.current = event.detail;
      
      // Check if AI reached the end
      if (aiPositionRef.current.x === maze.end.x && 
          aiPositionRef.current.y === maze.end.y && 
          gameActive && !gameWon) {
        console.log('AI reached the end! Player loses.');
        gameStateStableRef.current.aiWon = true;
        handleWin(false); // Player lost
      }
    };
    
    window.addEventListener('ai-position-update', handleAIPositionUpdate);
    
    return () => {
      window.removeEventListener('ai-position-update', handleAIPositionUpdate);
    };
  }, [maze, gameActive, gameWon, handleWin]);

  // Setup function for AI movement - we want this to run only once
  // but we do need to acknowledge the dependencies by adding a comment
  useEffect(() => {
    // Skip if already initialized
    if (hasInitializedAI.current) return;
    
    // Function to handle AI movement
    const handleAIMovement = () => {
      // Only run if in AI mode
      if (gameStateStableRef.current.gameMode !== modes.VS_AI) return;
      
      // Only set up interval once
      if (aiIntervalIdRef.current) return;
      
      console.log('Setting up permanent AI movement handler');
      
      // Function to update AI position that doesn't rely on closure variables
      const updateAIPathAndPosition = () => {
        const currentMaze = mazeRef.current;
        const updateAIPositionFn = updateAIPositionRef.current;
        
        if (!currentMaze || !currentMaze.grid || !gameStateRef.current.gameActive || 
            gameStateRef.current.gameWon || !updateAIPositionFn) {
          return;
        }
        
        const currentPos = positionRef.current;
        const endPos = { x: currentMaze.end.x, y: currentMaze.end.y };
        
        // Use requestAnimationFrame to avoid blocking the main thread
        window.requestAnimationFrame(() => {
          updateAIPositionFn(currentMaze.grid, currentPos, endPos);
        });
      };
      
      // Interval for AI movement
      const intervalDuration = 200;
      
      // Set up the interval only once
      aiIntervalIdRef.current = setInterval(updateAIPathAndPosition, intervalDuration);
      
      // Mark as initialized
      hasInitializedAI.current = true;
    };
    
    // Set up event listener for game mode changes
    window.addEventListener('game-initialized', handleAIMovement);
    
    // Initial setup if already in AI mode
    if (gameMode === modes.VS_AI && maze) {
      handleAIMovement();
    }
    
    // Cleanup function that will only run when component unmounts
    return () => {
      window.removeEventListener('game-initialized', handleAIMovement);
      if (aiIntervalIdRef.current) {
        clearInterval(aiIntervalIdRef.current);
        aiIntervalIdRef.current = null;
      }
    };
    
    // We're intentionally using an empty dependency array as we want this to run only once
    // and we're using refs to access the latest values of gameMode, modes.VS_AI, and maze
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Initialize a new game
  const initGame = useCallback(() => {
    console.log('Initializing new game with difficulty:', difficulty);
    
    // Clean up any existing game state
    if (aiIntervalIdRef.current) {
      clearInterval(aiIntervalIdRef.current);
      aiIntervalIdRef.current = null;
      hasInitializedAI.current = false;
    }
    
    try {
      console.log('Generating new maze with difficulty:', difficulty);
      const newMaze = generateMaze(difficulty);
      
      if (!newMaze || !newMaze.grid || !newMaze.start || !newMaze.end) {
        throw new Error('Invalid maze structure generated');
      }
      
      const startPos = { ...newMaze.start };
      console.log('Generated new maze:', { start: startPos, end: newMaze.end });
      
      // Reset game state
      setMaze(newMaze);
      setPosition(startPos);
      positionRef.current = startPos;
      setSteps(0);
      setTime(0);
      
      // Reset and restart timer completely
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      startTimeRef.current = Date.now(); // Set new start time
      timeRef.current = 0;
      setFinalTime(0);
      
      setGameActive(true);
      setGameWon(false);
      
      // Initialize AI if in VS AI mode
      if (gameMode === modes.VS_AI) {
        console.log('Initializing AI player');
        resetAI();
        const aiPlayer = initAIPlayer(difficulty);
        if (!aiPlayer) {
          throw new Error('Failed to initialize AI player');
        }
        
        // Dispatch custom event to notify AI movement handler
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('game-initialized'));
        }, 100);
      }
    } catch (error) {
      console.error('Error initializing game:', error);
      alert('Error initializing game. Please try again.');
      setGameActive(false);
      setGameWon(false);
      if (aiIntervalIdRef.current) {
        clearInterval(aiIntervalIdRef.current);
        aiIntervalIdRef.current = null;
      }
    }
    
    return () => {
      console.log('Cleaning up game initialization');
      if (aiMoveInterval.current) {
        clearInterval(aiMoveInterval.current);
        aiMoveInterval.current = null;
      }
    };
  }, [difficulty, gameMode, modes.VS_AI, initAIPlayer, resetAI]);

  // Initialize game on mount and when difficulty or game mode changes
  useEffect(() => {
    console.log('Game component mounted or initGame changed');
    const cleanup = initGame();
    
    return () => {
      console.log('Cleaning up game component');
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
      if (aiMoveInterval.current) {
        clearInterval(aiMoveInterval.current);
        aiMoveInterval.current = null;
      }
    };
  }, [initGame]);

  // Handle resetting the game
  const handleReset = useCallback(() => {
    console.log('Resetting game...');
    setGameActive(false);
    setGameWon(false);
    
    // Reset timer state completely
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    startTimeRef.current = 0;
    timeRef.current = 0;
    setTime(0);
    setFinalTime(0);
    
    // Clean up AI movement handler to avoid memory leaks
    if (aiIntervalIdRef.current) {
      clearInterval(aiIntervalIdRef.current);
      aiIntervalIdRef.current = null;
      hasInitializedAI.current = false; // Allow reinitializing AI
    }
    
    // Reset all game state
    resetAI();
    
    // Delay the actual game initialization to ensure clean state
    setTimeout(() => {
      initGame();
    }, 50);
  }, [initGame, resetAI]);

  
  // Handle timer updates - use ref to prevent recreation on each render
  const handleTimerUpdate = useRef((newTime) => {
    setTime(newTime);
  }).current;
  
  // Toggle AI path visibility
  const toggleAIPath = useCallback(() => {
    setShowAIPath(prev => !prev);
  }, []);
  
  // Handle back to menu
  const handleBack = useCallback(() => {
    if (aiMoveInterval.current) {
      clearInterval(aiMoveInterval.current);
      aiMoveInterval.current = null;
    }
    resetAI();
    onBackToMenu();
  }, [onBackToMenu, resetAI]);

  // Handle moving the player
  const handleMove = useCallback((direction) => {
    if (!gameActive || !maze || gameWon) return;
    
    playMoveSound();
    setPosition(prevPos => {
      const newPos = { ...prevPos };
      
      // Check if wall exists in the direction of movement
      switch (direction) {
        case 'up':
          if (!maze.grid[prevPos.y][prevPos.x].walls.top) newPos.y--;
          break;
        case 'right':
          if (!maze.grid[prevPos.y][prevPos.x].walls.right) newPos.x++;
          break;
        case 'down':
          if (!maze.grid[prevPos.y][prevPos.x].walls.bottom) newPos.y++;
          break;
        case 'left':
          if (!maze.grid[prevPos.y][prevPos.x].walls.left) newPos.x--;
          break;
        default:
          break;
      }
      
      // Update the position ref
      positionRef.current = { ...newPos };
      
      // Check if player reached the end
      if (newPos.x === maze.end.x && newPos.y === maze.end.y) {
        // Set a timeout to allow the UI to update before showing win message
        setTimeout(() => {
          handleWin(true); // Player won
        }, 100);
      }
      
      return newPos;
    });
    
    setSteps(prevSteps => prevSteps + 1);
  }, [gameActive, gameWon, maze, handleWin]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!gameActive) return;
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove('up');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove('right');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove('left');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive, handleMove]);

  // Calculate player progress
  const playerProgress = maze ? 
    Math.max(0, 100 - (Math.abs(position.x - maze.end.x) + Math.abs(position.y - maze.end.y)) / 
    (maze.width + maze.height) * 50) : 0;

  if (!maze) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-pulse text-white text-2xl font-bold">Loading maze...</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-500 opacity-30"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col">
      {/* Game header with stats and controls */}
      <header className="bg-black/30 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleBack}
              variant="ghost" 
              className="text-white hover:bg-white/10 rounded-lg"
              aria-label="Back to menu"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" /> Menu
            </Button>
            
            <div className="hidden md:flex items-center space-x-3">
              <div className="bg-violet-800/30 px-3 py-1.5 rounded-full flex items-center">
                <UserIcon className="h-4 w-4 text-violet-300 mr-2" />
                <span className="text-violet-100 font-medium">Player</span>
              </div>
              
              {gameMode === modes.VS_AI && (
                <div className="bg-rose-800/30 px-3 py-1.5 rounded-full flex items-center">
                  <CpuChipIcon className="h-4 w-4 text-rose-300 mr-2" />
                  <span className="text-rose-100 font-medium">AI</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex items-center space-x-1 bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-lg"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              <span>Restart</span>
            </Button>
            
            <div className="bg-indigo-900/40 px-3 py-2 rounded-lg border border-indigo-500/30 shadow-inner">
              <Timer gameActive={gameActive} onTimerUpdate={handleTimerUpdate} />
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        {gameMode === modes.VS_AI && (
          <div className="h-2 bg-black/40 w-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300 relative overflow-hidden"
              style={{ 
                width: `${aiProgress > 0 ? (playerProgress + aiProgress) / 2 : playerProgress}%`,
                background: 'linear-gradient(90deg, rgba(124,58,237,1) 0%, rgba(236,72,153,1) 100%)'
              }}
            >
              <div className="absolute inset-0 bg-white/20 overflow-hidden">
                <div className="w-24 h-full bg-white/30 -skew-x-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main game area */}
      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col items-center">
        {/* Game stats */}
        <div className="w-full max-w-2xl mb-6 bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-purple-500/20 shadow-lg">
          <GameStats 
            steps={steps} 
            time={time} 
            difficulty={difficulty}
            gameMode={gameMode}
            aiProgress={gameMode === modes.VS_AI ? aiProgress : null}
            playerProgress={playerProgress}
          />
          
          {/* AI Taunt */}
          {aiTaunt && (
            <div className="mt-3 p-2 bg-indigo-900/50 border border-indigo-500/30 rounded-lg text-indigo-200 text-center animate-pulse">
              {aiTaunt}
            </div>
          )}
        </div>
        
        {/* Maze container */}
        <div className="relative w-full max-w-3xl mx-auto bg-black/30 rounded-xl p-4 md:p-6 backdrop-blur-sm border border-purple-500/20 shadow-xl overflow-auto">
          <div className="flex justify-center items-center min-w-full">
            <Maze 
              maze={maze} 
              position={position} 
              setPosition={setPosition}
              gameActive={gameActive}
              onWin={handleWin}
              incrementSteps={() => setSteps(prev => prev + 1)}
              aiPosition={gameMode === modes.VS_AI ? aiPosition : null}
              showAIPath={showAIPath}
              aiPath={aiPath}
            />
          </div>
          
          {/* Mobile controls */}
          <div className="md:hidden mt-6">
            <div className="grid grid-cols-3 gap-2 place-items-center">
              <div></div>
              <Button
                onClick={() => handleMove('up')}
                variant="ghost"
                className="w-full h-16 flex items-center justify-center bg-indigo-800/30 rounded-xl text-white hover:bg-indigo-700/40 active:scale-95 transition-all duration-150"
                aria-label="Move up"
              >
                <ArrowUpIcon className="h-8 w-8" />
              </Button>
              <div></div>
              
              <Button
                onClick={() => handleMove('left')}
                variant="ghost"
                className="w-full h-16 flex items-center justify-center bg-indigo-800/30 rounded-xl text-white hover:bg-indigo-700/40 active:scale-95 transition-all duration-150"
                aria-label="Move left"
              >
                <ArrowLeftIcon className="h-8 w-8" />
              </Button>
              
              <Button
                onClick={() => handleMove('down')}
                variant="ghost"
                className="w-full h-16 flex items-center justify-center bg-indigo-800/30 rounded-xl text-white hover:bg-indigo-700/40 active:scale-95 transition-all duration-150"
                aria-label="Move down"
              >
                <ArrowDownIcon className="h-8 w-8" />
              </Button>
              
              <Button
                onClick={() => handleMove('right')}
                variant="ghost"
                className="w-full h-16 flex items-center justify-center bg-indigo-800/30 rounded-xl text-white hover:bg-indigo-700/40 active:scale-95 transition-all duration-150"
                aria-label="Move right"
              >
                <ArrowRightIcon className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Win screen - Pass the finalTime directly from state */}
      {gameWon && (
        <WinScreen
          steps={steps}
          time={finalTime} // Use our dedicated finalTime state
          difficulty={difficulty}
          onReset={handleReset}
          playerWon={gameStateStableRef.current.playerWon}
        />
      )}
    </div>
  );
};

export default Game;
