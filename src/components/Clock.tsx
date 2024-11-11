import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center">
      <div className="text-3xl font-mono font-bold">
        {time.toLocaleTimeString('en-US', { 
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })}
      </div>
      <div className="text-lg text-gray-300 font-semibold">
        {time.toLocaleDateString('en-US', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })}
      </div>
    </div>
  );
};

export default Clock;