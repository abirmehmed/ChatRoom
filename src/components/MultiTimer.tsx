import React, { useState, useEffect } from 'react';
import { Clock, X, Play, Pause, RotateCcw } from 'lucide-react';

interface Timer {
  duration: number;
  remaining: number;
  isActive: boolean;
}

const MultiTimer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timer, setTimer] = useState<Timer>({
    duration: 20 * 60, // 20 minutes in seconds
    remaining: 20 * 60,
    isActive: false
  });
  const [customMinutes, setCustomMinutes] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.isActive && prev.remaining > 0) {
          const newRemaining = prev.remaining - 1;
          if (newRemaining === 0) {
            new Audio('/notification.mp3').play().catch(() => {});
          }
          return { ...prev, remaining: newRemaining };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCustomDuration = () => {
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0) {
      const duration = minutes * 60;
      setTimer({
        duration,
        remaining: duration,
        isActive: false
      });
      setCustomMinutes('');
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="bg-gray-800 p-2 rounded-lg shadow-lg hover:bg-gray-700"
      >
        <Clock size={20} />
      </button>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg w-[250px]">
      <div className="p-2 flex items-center justify-between">
        <Clock size={16} />
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-300"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 border-t border-gray-700">
        <div className="text-center mb-4">
          <div className="text-3xl font-mono mb-2">
            {formatTime(timer.remaining)}
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setTimer(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`${
                timer.isActive ? 'bg-yellow-600' : 'bg-green-600'
              } text-white px-4 py-2 rounded-lg hover:opacity-90`}
            >
              {timer.isActive ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={() => setTimer(prev => ({ ...prev, remaining: prev.duration, isActive: false }))}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Minutes"
            className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg"
          />
          <button
            onClick={handleCustomDuration}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiTimer;