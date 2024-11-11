import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface ScheduleItem {
  id: string;
  day: string;
  task: string;
  priority: 'low' | 'medium' | 'high';
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WeeklySchedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const savedSchedule = localStorage.getItem('weeklySchedule');
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('weeklySchedule', JSON.stringify(schedule));
  }, [schedule]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="bg-gray-800 p-2 rounded-lg shadow-lg hover:bg-gray-700"
      >
        <Calendar size={20} />
      </button>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-2 w-[600px]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <h2 className="text-sm font-semibold">Weekly Schedule</h2>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {DAYS.map(day => (
                <th key={day} className="px-2 py-1 text-left border-b border-gray-700">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {DAYS.map(day => (
                <td key={day} className="px-2 py-1 border-b border-gray-700 align-top">
                  <div className="space-y-1">
                    {schedule
                      .filter(item => item.day === day)
                      .map(item => (
                        <div
                          key={item.id}
                          className="bg-gray-700 p-1 rounded text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span>{item.task}</span>
                            <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklySchedule;