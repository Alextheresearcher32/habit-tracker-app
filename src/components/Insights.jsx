import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import useStore from '../store/useStore';
import { getLastNDays, formatDate } from '../utils/dateHelpers';

const Insights = () => {
  const { moods, habits, meditations } = useStore();
  const [timeRange, setTimeRange] = useState(7);

  // Prepare mood data
  const getMoodData = () => {
    const days = getLastNDays(timeRange);
    return days.map(date => {
      const moodEntry = moods.find(m => m.date === date);
      return {
        date: formatDate(date),
        mood: moodEntry ? moodEntry.mood : null,
        fullDate: date
      };
    });
  };

  // Prepare habit completion data
  const getHabitData = () => {
    const days = getLastNDays(timeRange);
    return days.map(date => {
      const completed = habits.filter(habit => 
        habit.completions?.includes(date)
      ).length;
      const total = habits.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        date: formatDate(date),
        completed,
        total,
        percentage,
        fullDate: date
      };
    });
  };

  // Calculate overall stats
  const calculateStats = () => {
    const moodData = getMoodData().filter(d => d.mood !== null);
    const avgMood = moodData.length > 0 
      ? (moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length).toFixed(1)
      : 0;

    const habitData = getHabitData();
    const avgCompletion = habitData.length > 0
      ? Math.round(habitData.reduce((sum, d) => sum + d.percentage, 0) / habitData.length)
      : 0;

    const totalMeditation = meditations.reduce((sum, m) => sum + m.duration, 0);

    return { avgMood, avgCompletion, totalMeditation };
  };

  const moodData = getMoodData();
  const habitData = getHabitData();
  const stats = calculateStats();

  const moodEmojis = ['', '😞', '😕', '😐', '🙂', '😄'];
  const moodLabels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Great'];

  const CustomMoodTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      if (data.mood) {
        return (
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-800">{data.date}</p>
            <p className="text-lg">{moodEmojis[data.mood]} {moodLabels[data.mood]}</p>
          </div>
        );
      }
    }
    return null;
  };

  const CustomHabitTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-800">{data.date}</p>
          <p className="text-sm text-gray-600">
            {data.completed} of {data.total} habits ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-display text-gradient mb-2">
          Insights
        </h1>
        <p className="text-gray-600">Track your progress over time</p>
      </header>

      {/* Time Range Selector */}
      <div className="flex justify-center gap-3 mb-6 animate-fade-in">
        {[7, 14, 30].map(days => (
          <button
            key={days}
            onClick={() => setTimeRange(days)}
            className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
              timeRange === days
                ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md'
                : 'bg-white/60 text-gray-600 hover:bg-white'
            }`}
          >
            {days} days
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6 animate-slide-up">
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gradient mb-1">
            {stats.avgMood > 0 ? stats.avgMood : '-'}
          </div>
          <div className="text-xs text-gray-600">Avg Mood</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gradient mb-1">
            {stats.avgCompletion}%
          </div>
          <div className="text-xs text-gray-600">Habits Done</div>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-gradient mb-1">
            {stats.totalMeditation}
          </div>
          <div className="text-xs text-gray-600">Min Meditated</div>
        </div>
      </div>

      {/* Mood Trend Chart */}
      {moods.length > 0 ? (
        <div className="glass-card rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            <h2 className="font-semibold text-gray-800">Mood Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomMoodTooltip />} />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#fb7185" 
                strokeWidth={3}
                dot={{ fill: '#fb7185', r: 5 }}
                activeDot={{ r: 7 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center mb-6 animate-slide-up">
          <TrendingUp className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <p className="text-gray-600">Start logging your mood to see trends</p>
        </div>
      )}

      {/* Habit Completion Chart */}
      {habits.length > 0 ? (
        <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-rose-400" />
            <h2 className="font-semibold text-gray-800">Habit Completion</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={habitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomHabitTooltip />} />
              <Bar 
                dataKey="percentage" 
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 text-center animate-slide-up">
          <Calendar className="w-12 h-12 text-rose-300 mx-auto mb-3" />
          <p className="text-gray-600">Add habits to track your completion rate</p>
        </div>
      )}

      {/* Insights */}
      {moods.length > 0 && habits.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mt-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h3 className="font-semibold text-gray-800 mb-3">💡 Quick Insights</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {stats.avgMood >= 4 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>You've been feeling great lately! Keep it up!</span>
              </li>
            )}
            {stats.avgCompletion >= 70 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Excellent habit consistency at {stats.avgCompletion}%</span>
              </li>
            )}
            {stats.avgCompletion < 50 && habits.length > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-orange-500">!</span>
                <span>Try focusing on fewer habits to improve consistency</span>
              </li>
            )}
            {meditations.length >= 3 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>You're building a strong meditation practice!</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Insights;
