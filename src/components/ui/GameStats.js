import React from 'react';

/**
 * Component for displaying game statistics (steps, time)
 */
const GameStats = ({ steps, time, difficulty }) => {
  // Format time to show minutes and seconds with labels
  const formatTime = (totalSeconds) => {
    if (typeof totalSeconds !== 'number') {
      console.error('Invalid time value:', totalSeconds);
      totalSeconds = 0;
    }
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };
  
  // Icons for stats
  const icons = {
    steps: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
      </svg>
    ),
    time: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
    difficulty: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
      </svg>
    )
  };
  
  const formattedTime = formatTime(time);
  
  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-10 text-center">
      <div className="bg-white/10 backdrop-blur-md rounded-lg py-3 px-5 shadow-xl border border-white/10 transition-all hover:bg-white/15">
        <div className="flex items-center justify-center gap-2 text-indigo-300 mb-1">
          {icons.steps}
          <span>Steps</span>
        </div>
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{steps}</div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-lg py-3 px-5 shadow-xl border border-white/10 transition-all hover:bg-white/15">
        <div className="flex items-center justify-center gap-2 text-indigo-300 mb-1">
          {icons.time}
          <span>Time</span>
        </div>
        <div className="time-display">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center mx-1">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{formattedTime.minutes}</span>
              <span className="text-xs font-medium text-indigo-300">min</span>
            </div>
            <span className="text-xl font-bold text-indigo-400 mx-0.5">:</span>
            <div className="flex flex-col items-center justify-center mx-1">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{formattedTime.seconds}</span>
              <span className="text-xs font-medium text-indigo-300">sec</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md rounded-lg py-3 px-5 shadow-xl border border-white/10 transition-all hover:bg-white/15">
        <div className="flex items-center justify-center gap-2 text-indigo-300 mb-1">
          {icons.difficulty}
          <span>Difficulty</span>
        </div>
        <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 capitalize">{difficulty}</div>
      </div>
    </div>
  );
};

export default GameStats;
