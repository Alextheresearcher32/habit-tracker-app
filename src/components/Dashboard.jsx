import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, Calendar as CalendarIcon } from 'lucide-react';
import useStore from '../store/useStore';
import { getTodayString, getLastNDays, formatDate } from '../utils/dateHelpers';

const Dashboard = () => {
  const { habits, addHabit, deleteHabit, toggleHabit, editHabit, getHabitStreak } = useStore();
  const [newHabit, setNewHabit] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showCalendar, setShowCalendar] = useState(null);

  const today = getTodayString();

  const handleAdd = (e) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabit(newHabit.trim());
      setNewHabit('');
    }
  };

  const handleEdit = (habit) => {
    setEditingId(habit.id);
    setEditText(habit.name);
  };

  const saveEdit = () => {
    if (editText.trim()) {
      editHabit(editingId, editText.trim());
      setEditingId(null);
      setEditText('');
    }
  };

  const isCompleted = (habit, date) => {
    return habit.completions?.includes(date) || false;
  };

  const MiniCalendar = ({ habit }) => {
    const last7Days = getLastNDays(7);
    
    return (
      <div className="flex gap-1 mt-2">
        {last7Days.map((date) => {
          const completed = isCompleted(habit, date);
          const isToday = date === today;
          
          return (
            <div
              key={date}
              className={`calendar-day w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium
                ${completed 
                  ? 'bg-gradient-to-br from-rose-400 to-pink-400 text-white shadow-md' 
                  : 'bg-white/60 text-gray-400'
                }
                ${isToday ? 'ring-2 ring-rose-500 ring-offset-2' : ''}
              `}
            >
              {new Date(date).getDate()}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-display text-gradient mb-2">
          Daily Habits
        </h1>
        <p className="text-gray-600">Build consistency, one day at a time</p>
      </header>

      {/* Add New Habit */}
      <form onSubmit={handleAdd} className="mb-6 animate-fade-in">
        <div className="glass-card rounded-2xl p-4 flex gap-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <button 
            type="submit"
            className="bg-gradient-to-r from-rose-400 to-pink-400 text-white p-2 rounded-xl hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No habits yet</h3>
            <p className="text-gray-500 text-sm">Start by adding your first habit above</p>
          </div>
        ) : (
          habits.map((habit, index) => {
            const streak = getHabitStreak(habit.id);
            const completed = isCompleted(habit, today);

            return (
              <div
                key={habit.id}
                className="glass-card rounded-2xl p-4 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleHabit(habit.id, today)}
                    className={`habit-checkbox mt-1 flex-shrink-0 ${completed ? 'checked' : ''}`}
                  >
                    {completed && <Check className="w-4 h-4 text-white" />}
                  </button>

                  {/* Habit Content */}
                  <div className="flex-1 min-w-0">
                    {editingId === habit.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="flex-1 bg-white/80 px-3 py-1 rounded-lg outline-none focus:ring-2 focus:ring-rose-300"
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="bg-rose-400 text-white px-3 py-1 rounded-lg hover:bg-rose-500 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`font-medium ${completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                            {habit.name}
                          </h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(habit)}
                              className="text-gray-400 hover:text-rose-400 transition-colors p-1"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteHabit(habit.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            🔥 <span className="font-semibold text-orange-500">{streak.current}</span> day streak
                          </span>
                          <span className="text-gray-400">•</span>
                          <span>Best: {streak.best}</span>
                        </div>

                        {/* Mini Calendar */}
                        <MiniCalendar habit={habit} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      {habits.length > 0 && (
        <div className="mt-6 glass-card rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-600">
            {habits.filter(h => isCompleted(h, today)).length} of {habits.length} habits completed today
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-gradient-to-r from-rose-400 to-pink-400 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(habits.filter(h => isCompleted(h, today)).length / habits.length) * 100}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
