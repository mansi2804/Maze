import React from 'react';

/**
 * Component for selecting game difficulty
 */
const DifficultySelector = ({ difficulty, onChangeDifficulty }) => {
  // Options for difficulty levels
  const difficultyOptions = [
    { 
      value: 'easy', 
      label: 'Simple', 
      gradient: 'from-emerald-400 to-green-500',
      activeGradient: 'from-emerald-500 to-green-600',
      icon: '🌱'
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      gradient: 'from-amber-400 to-orange-500',
      activeGradient: 'from-amber-500 to-orange-600',
      icon: '🔥'
    },
    { 
      value: 'hard', 
      label: 'Difficult', 
      gradient: 'from-rose-400 to-red-500',
      activeGradient: 'from-rose-500 to-red-600',
      icon: '💀'
    }
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
        {difficultyOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onChangeDifficulty(option.value)}
            className={`relative overflow-hidden group px-4 py-3 rounded-lg text-white font-medium
              bg-gradient-to-r ${difficulty === option.value ? option.activeGradient : option.gradient}
              ${difficulty === option.value ? 'ring-2 ring-white/50 shadow-lg' : 'opacity-90'}
              transition-all duration-300 hover:shadow-lg hover:opacity-100 transform ${difficulty === option.value ? 'scale-102' : ''}
            `}
          >
            <div className="flex items-center justify-center">
              <span className="mr-2 text-lg">{option.icon}</span>
              <span>{option.label}</span>
            </div>
            
            {difficulty === option.value && (
              <div className="absolute inset-0 border-2 border-white/20 rounded-lg pointer-events-none"></div>
            )}
            
            <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-white/10 rounded-full blur-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;
