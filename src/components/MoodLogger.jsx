import React, { useState, useEffect } from 'react';
import { MessageCircle, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';
import { formatFullDate, getTodayString } from '../utils/dateHelpers';

const moods = [
  { value: 1, emoji: '😞', label: 'Terrible', color: 'from-red-400 to-red-500' },
  { value: 2, emoji: '😕', label: 'Bad', color: 'from-orange-400 to-orange-500' },
  { value: 3, emoji: '😐', label: 'Okay', color: 'from-yellow-400 to-yellow-500' },
  { value: 4, emoji: '🙂', label: 'Good', color: 'from-green-400 to-green-500' },
  { value: 5, emoji: '😄', label: 'Great', color: 'from-emerald-400 to-emerald-500' },
];

const MoodLogger = () => {
  const { addMood, getTodayMood, moods: moodHistory } = useStore();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const todayMood = getTodayMood();
    if (todayMood) {
      setSelectedMood(todayMood.mood);
      setNote(todayMood.note || '');
    }
  }, [getTodayMood]);

  const handleSave = () => {
    if (selectedMood) {
      addMood(selectedMood, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const selectedMoodData = moods.find(m => m.value === selectedMood);
  const recentMoods = moodHistory.slice(-7).reverse();

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-display text-gradient mb-2">
          How are you feeling?
        </h1>
        <p className="text-gray-600">{formatFullDate(new Date())}</p>
      </header>

      {/* Mood Selector */}
      <div className="glass-card rounded-3xl p-8 mb-6 animate-fade-in">
        <div className="flex justify-around items-center mb-6">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`mood-emoji ${selectedMood === mood.value ? 'selected' : ''}`}
            >
              {mood.emoji}
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="text-center mb-6 animate-fade-in">
            <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${selectedMoodData.color} text-white font-medium shadow-md`}>
              {selectedMoodData.label}
            </div>
          </div>
        )}

        {/* Note Input */}
        <div className="relative">
          <MessageCircle className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind? (optional)"
            className="w-full pl-11 pr-4 py-3 bg-white/60 rounded-xl outline-none focus:ring-2 focus:ring-rose-300 resize-none text-gray-700 placeholder-gray-400"
            rows="3"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!selectedMood}
          className={`w-full mt-4 py-3 rounded-xl font-medium transition-all duration-200 ${
            selectedMood
              ? 'btn-primary'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saved ? '✓ Saved!' : 'Save Mood'}
        </button>
      </div>

      {/* Recent Moods */}
      {recentMoods.length > 0 && (
        <div className="glass-card rounded-2xl p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            <h2 className="font-semibold text-gray-800">Recent Check-ins</h2>
          </div>

          <div className="space-y-3">
            {recentMoods.map((entry, index) => {
              const moodData = moods.find(m => m.value === entry.mood);
              const isToday = entry.date === getTodayString();

              return (
                <div
                  key={index}
                  className={`p-3 rounded-xl bg-white/50 ${isToday ? 'ring-2 ring-rose-300' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{moodData?.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-800">{moodData?.label}</p>
                        <p className="text-xs text-gray-500">
                          {isToday ? 'Today' : new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  {entry.note && (
                    <p className="text-sm text-gray-600 mt-2 pl-9">"{entry.note}"</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recentMoods.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Start tracking your mood</h3>
          <p className="text-gray-500 text-sm">Check in daily to see patterns and trends</p>
        </div>
      )}
    </div>
  );
};

export default MoodLogger;
