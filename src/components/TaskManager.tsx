import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, X, Edit2, Save, ChevronDown, ChevronUp } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface WeeklyTarget {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

const TaskManager: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weeklyTargets, setWeeklyTargets] = useState<WeeklyTarget[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' as const, dueDate: '' });
  const [newTarget, setNewTarget] = useState({ title: '', dueDate: '' });

  useEffect(() => {
    const savedTasks = localStorage.getItem('dailyTasks');
    const savedTargets = localStorage.getItem('weeklyTargets');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedTargets) setWeeklyTargets(JSON.parse(savedTargets));
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
    localStorage.setItem('weeklyTargets', JSON.stringify(weeklyTargets));
  }, [tasks, weeklyTargets]);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="bg-gray-800 p-2 rounded-lg shadow-lg hover:bg-gray-700"
      >
        <CheckSquare size={20} />
      </button>
    );
  }

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        completed: false,
        priority: newTask.priority,
        dueDate: newTask.dueDate || undefined,
      };
      setTasks(prev => [...prev, task]);
      setNewTask({ title: '', priority: 'medium', dueDate: '' });
      setShowTaskForm(false);
    }
  };

  const addWeeklyTarget = () => {
    if (newTarget.title.trim() && newTarget.dueDate) {
      const target: WeeklyTarget = {
        id: Date.now().toString(),
        title: newTarget.title,
        completed: false,
        dueDate: newTarget.dueDate,
      };
      setWeeklyTargets(prev => [...prev, target]);
      setNewTarget({ title: '', dueDate: '' });
      setShowTargetForm(false);
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleTargetCompletion = (id: string) => {
    setWeeklyTargets(prev => prev.map(target => 
      target.id === id ? { ...target, completed: !target.completed } : target
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const deleteTarget = (id: string) => {
    setWeeklyTargets(prev => prev.filter(target => target.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg w-[250px]">
      <div className="p-2 flex items-center justify-between">
        <CheckSquare size={16} />
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      <div className="p-2 border-t border-gray-700">
        {/* Weekly Targets Section */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold">Weekly Targets</h3>
            <button
              onClick={() => setShowTargetForm(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Plus size={12} />
            </button>
          </div>

          {showTargetForm && (
            <div className="mb-2 space-y-1">
              <input
                type="text"
                value={newTarget.title}
                onChange={(e) => setNewTarget(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter target..."
                className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
              />
              <input
                type="date"
                value={newTarget.dueDate}
                onChange={(e) => setNewTarget(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
              />
              <div className="flex gap-1">
                <button
                  onClick={addWeeklyTarget}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Add Target
                </button>
                <button
                  onClick={() => setShowTargetForm(false)}
                  className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1 max-h-[100px] overflow-y-auto">
            {weeklyTargets.map(target => (
              <div
                key={target.id}
                className="flex items-center justify-between bg-gray-700 p-1 rounded"
              >
                <div className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={target.completed}
                    onChange={() => toggleTargetCompletion(target.id)}
                    className="rounded bg-gray-600"
                  />
                  <div className={`text-xs ${target.completed ? 'line-through text-gray-400' : ''}`}>
                    <div>{target.title}</div>
                    <div className="text-[10px] text-gray-400">Due: {new Date(target.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <button
                  onClick={() => deleteTarget(target.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-semibold">Daily Tasks</h3>
            <button
              onClick={() => setShowTaskForm(true)}
              className="text-blue-400 hover:text-blue-300"
            >
              <Plus size={12} />
            </button>
          </div>

          {showTaskForm && (
            <div className="mb-2 space-y-1">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task..."
                className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
              />
              <div className="flex gap-1">
                <button
                  onClick={addTask}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowTaskForm(false)}
                  className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1 max-h-[150px] overflow-y-auto">
            {tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-gray-700 p-1 rounded"
              >
                <div className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="rounded bg-gray-600"
                  />
                  <div className={`text-xs ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    <div className="flex items-center gap-1">
                      <span>{task.title}</span>
                      <span className={`text-[10px] ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.dueDate && (
                      <div className="text-[10px] text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;