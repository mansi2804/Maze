import React from 'react';
import { useMultiplayer, GAME_MODES } from '../../context/MultiplayerContext';
import Button from './Button';

const GameModeSelector = ({ onSelect }) => {
  const { setGameMode, GAME_MODES: modes } = useMultiplayer();

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    onSelect(mode);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Select Game Mode</h2>
      
      <div className="space-y-4">
        <div 
          className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleModeSelect(modes.SINGLE_PLAYER)}
        >
          <h3 className="font-semibold text-lg text-gray-800">Single Player</h3>
          <p className="text-gray-600 mt-1">Play alone and try to beat your best time.</p>
        </div>
        
        <div 
          className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => handleModeSelect(modes.VS_AI)}
        >
          <h3 className="font-semibold text-lg text-gray-800">Race Against AI</h3>
          <p className="text-gray-600 mt-1">Compete against an AI opponent in real-time.</p>
        </div>
        
        <div 
          className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors opacity-50"
          title="Coming soon"
        >
          <h3 className="font-semibold text-lg text-gray-500">Multiplayer (Coming Soon)</h3>
          <p className="text-gray-400 mt-1">Challenge your friends in real-time races.</p>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;
