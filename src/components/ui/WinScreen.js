import React, { useEffect, useState } from 'react';
import GameStats from './GameStats';
import Button from './Button';

/**
 * Component for displaying the win screen with celebration effects
 */
const WinScreen = ({ steps, time, difficulty, onReset, playerWon = true }) => {
  // State to manage fireworks and falling elements
  const [fireworks, setFireworks] = useState([]);
  const [fallingItems, setFallingItems] = useState([]);
  
  // Generate a random firework position and color
  const generateFirework = () => {
    const colors = [
      'from-yellow-300 to-red-500',
      'from-green-300 to-blue-500',
      'from-pink-300 to-purple-500',
      'from-blue-300 to-indigo-500',
      'from-red-300 to-yellow-500',
      'from-purple-300 to-pink-500',
    ];
    
    return {
      id: Math.random(),
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.floor(40 + Math.random() * 60),
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      duration: 0.5 + Math.random() * 1,
    };
  };
  
  // Generate random falling celebration items
  const generateFallingItem = () => {
    const emojis = ['🎉', '🎊', '✨', '⭐', '🏆', '🎯', '🥇', '🎖️', '🎪', '🌟'];
    const speeds = ['fall-fast', 'fall', 'fall-slow'];
    const sizes = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'];
    
    return {
      id: Math.random(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 5,
      speed: speeds[Math.floor(Math.random() * speeds.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      rotate: Math.floor(Math.random() * 360),
      swayDelay: Math.random() * 2
    };
  };
  
  // Add celebrations when component mounts if player won
  useEffect(() => {
    if (!playerWon) return;
    
    // Initial fireworks
    const initialFireworks = Array.from({ length: 10 }, () => generateFirework());
    setFireworks(initialFireworks);
    
    // Initial falling items
    const initialFallingItems = Array.from({ length: 20 }, () => generateFallingItem());
    setFallingItems(initialFallingItems);
    
    // Add more fireworks at intervals
    const fireworkInterval = setInterval(() => {
      if (document.hidden) return; // Don't add fireworks if tab is not visible
      
      setFireworks(prev => {
        // Remove old fireworks if there are too many
        if (prev.length > 20) {
          return [...prev.slice(-15), generateFirework()];
        }
        return [...prev, generateFirework()];
      });
    }, 800);
    
    // Add more falling items at intervals
    const fallingItemsInterval = setInterval(() => {
      if (document.hidden) return; // Don't add items if tab is not visible
      
      setFallingItems(prev => {
        // Keep a reasonable number of items
        if (prev.length > 30) {
          const newItem = generateFallingItem();
          return [...prev.slice(-25), newItem];
        }
        return [...prev, generateFallingItem()];
      });
    }, 600);
    
    return () => {
      clearInterval(fireworkInterval);
      clearInterval(fallingItemsInterval);
    };
  }, [playerWon]);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 overflow-hidden">
      {/* Celebratory fireworks - only show if player won */}
      {playerWon && fireworks.map((firework) => (
        <div 
          key={firework.id}
          className={`absolute rounded-full bg-gradient-to-br ${firework.color} blur-md opacity-0 animate-firework pointer-events-none`}
          style={{
            top: firework.top,
            left: firework.left,
            width: `${firework.size}px`,
            height: `${firework.size}px`,
            animationDelay: `${firework.delay}s`,
            animationDuration: `${firework.duration}s`,
          }}
        />
      ))}
      
      {/* Falling celebration items - coming from top to bottom */}
      {playerWon && fallingItems.map((item) => (
        <div
          key={`falling-${item.id}`}
          className={`absolute ${item.size} ${item.speed} animate-sway pointer-events-none z-10`}
          style={{
            left: item.left,
            top: '-50px',
            animationDelay: `${item.delay}s`,
            animationDuration: '7s',
            transform: `rotate(${item.rotate}deg)`,
            animationTimingFunction: 'ease-in-out',
          }}
        >
          <div className="animate-sway" style={{ animationDelay: `${item.swayDelay}s` }}>
            {item.emoji}
          </div>
        </div>
      ))}
      
      {/* Floating particles */}
      {playerWon && Array.from({ length: 30 }).map((_, index) => (
        <div
          key={`particle-${index}`}
          className="absolute w-2 h-2 rounded-full opacity-70 animate-float pointer-events-none"
          style={{
            backgroundColor: ['#FFD700', '#FF6347', '#00CED1', '#9370DB', '#32CD32'][Math.floor(Math.random() * 5)],
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 7}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      
      {/* Win message card */}
      <div 
        className={`bg-gradient-to-br ${playerWon ? 'from-indigo-900 to-purple-900' : 'from-gray-800 to-gray-900'} 
        rounded-xl shadow-2xl p-8 m-4 max-w-xl w-full transform backdrop-blur-lg
        border-2 ${playerWon ? 'border-indigo-400/30' : 'border-red-500/30'}
        ${playerWon ? 'animate-bounce-slow' : ''} z-10 relative overflow-hidden`}
      >
        <div className="text-center relative">
          {playerWon ? (
            <>
              {/* Trophy directly above the message */}
              <div className="mb-6 mt-2">
                <div className="text-6xl animate-pulse inline-block">🏆</div>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">You Won!</h2>
              <p className="text-indigo-200 mb-6">Congratulations! You've completed the maze!</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-red-400 mb-2">AI Wins!</h2>
              <p className="text-gray-300 mb-6">The AI reached the end before you did. Better luck next time!</p>
            </>
          )}
          
          <div className="mb-8">
            <GameStats steps={steps} time={time} difficulty={difficulty} />
          </div>
          
          <Button
            onClick={onReset}
            size="lg"
            className={`px-8 transform hover:scale-105 ${playerWon ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700' : 'bg-gray-700 hover:bg-gray-600'} text-white`}
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WinScreen;
