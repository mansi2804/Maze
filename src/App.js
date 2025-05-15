import React, { useState } from 'react';
import Game from './components/Game';
import { GAME_MODES, MultiplayerProvider } from './context/MultiplayerContext';
import DifficultySelector from './components/ui/DifficultySelector';

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  
  const handleSelectGameMode = (mode) => {
    setGameMode(mode);
  };
  
  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
  };
  
  const handleBackToMenu = () => {
    setGameMode(null);
  };

  return (
    <MultiplayerProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {!gameMode ? (
          <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
              <div className="absolute w-64 h-64 bg-purple-500 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
              <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl bottom-20 -right-20 animate-pulse delay-1000"></div>
              <div className="absolute w-56 h-56 bg-pink-500 rounded-full blur-3xl bottom-10 left-20 animate-pulse delay-2000"></div>
            </div>
            
            <div className="z-10 w-full max-w-4xl bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-purple-500/20">
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 md:mb-12 text-center animate-text">
                Maze Runner
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <button 
                  onClick={() => handleSelectGameMode(GAME_MODES.SINGLE_PLAYER)}
                  className="relative overflow-hidden group bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-5 px-8 rounded-xl text-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/40 hover:shadow-xl active:scale-95"
                >
                  <span className="relative z-10">Single Player</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
                
                <button 
                  onClick={() => handleSelectGameMode(GAME_MODES.VS_AI)}
                  className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-5 px-8 rounded-xl text-xl shadow-lg transition-all duration-300 hover:shadow-blue-500/40 hover:shadow-xl active:scale-95"
                >
                  <span className="relative z-10">Against AI</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-bold text-center mb-4 text-purple-300">Select Difficulty</h3>
                <DifficultySelector 
                  difficulty={difficulty} 
                  onChangeDifficulty={handleDifficultyChange}
                />
              </div>
              
              <div className="text-center mt-10 text-purple-300/60 text-sm">
                <p>Use arrow keys to navigate the maze</p>
                <p>Reach the end before the AI does!</p>
              </div>
            </div>
          </div>
        ) : (
          <Game 
            gameMode={gameMode} 
            onBackToMenu={handleBackToMenu} 
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
          />
        )}
      </div>
    </MultiplayerProvider>
  );
}

export default App;
