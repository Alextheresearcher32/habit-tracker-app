import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Award } from 'lucide-react';
import useStore from '../store/useStore';

const durations = [
  { minutes: 5, label: '5 min' },
  { minutes: 10, label: '10 min' },
  { minutes: 15, label: '15 min' },
];

const MeditationTimer = () => {
  const { addMeditation, meditations } = useStore();
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    setIsRunning(false);
    setIsComplete(true);
    addMeditation(selectedDuration);
    
    // Play completion sound (if available)
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    setTimeout(() => {
      setIsComplete(false);
    }, 3000);
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedDuration * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    setIsComplete(false);
  };

  const handleDurationChange = (minutes) => {
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
    setIsComplete(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const totalSessions = meditations.length;
  const totalMinutes = meditations.reduce((sum, m) => sum + m.duration, 0);

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24">
      <header className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-display text-gradient mb-2">
          Meditation
        </h1>
        <p className="text-gray-600">Find your inner peace</p>
      </header>

      {/* Timer Display */}
      <div className="glass-card rounded-3xl p-8 mb-6 animate-fade-in">
        {/* Duration Selector */}
        <div className="flex justify-center gap-3 mb-8">
          {durations.map(({ minutes, label }) => (
            <button
              key={minutes}
              onClick={() => handleDurationChange(minutes)}
              disabled={isRunning}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedDuration === minutes
                  ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white shadow-md'
                  : 'bg-white/60 text-gray-600 hover:bg-white'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Circular Progress */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="transform -rotate-90 w-full h-full">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#fecdd3"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {isComplete ? (
                <div className="animate-fade-in">
                  <div className="text-5xl mb-2">✨</div>
                  <p className="text-2xl font-semibold text-gradient">Complete!</p>
                </div>
              ) : (
                <>
                  <div className="text-5xl font-display text-gray-800 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isRunning ? 'Breathe...' : 'Ready to begin'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="btn-primary flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="btn-secondary flex items-center gap-2"
            >
              <Pause className="w-5 h-5" />
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      {totalSessions > 0 && (
        <div className="glass-card rounded-2xl p-6 animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-rose-400" />
            <h2 className="font-semibold text-gray-800">Your Progress</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gradient mb-1">
                {totalSessions}
              </div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="bg-white/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gradient mb-1">
                {totalMinutes}
              </div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl">
            <p className="text-sm text-gray-700 text-center">
              {totalSessions < 5 
                ? "Keep going! Consistency is key 🌟"
                : totalSessions < 10
                ? "You're building a great habit! 🔥"
                : "Meditation master in the making! 🧘‍♀️"
              }
            </p>
          </div>
        </div>
      )}

      {totalSessions === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Start your practice</h3>
          <p className="text-gray-500 text-sm">Choose a duration and begin meditating</p>
        </div>
      )}
    </div>
  );
};

export default MeditationTimer;
