import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Award, Music, VolumeX, Volume2 } from 'lucide-react';
import useStore from '../store/useStore';

const sounds = [
  { id: 'ocean', name: 'Ocean Waves', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Oceanwavescrushing.ogg' },
  { id: 'forest', name: 'Forest Ambience', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/20090610_0_ambience.ogg' },
  { id: 'rain', name: 'Gentle Rain', url: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Bourne_woods_rain_2020-05-10_0800.mp3' },
  { id: 'bells', name: 'Meditation Bells', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Small_tibetan_singing_bowl.ogg' },
  { id: 'river', name: 'River Flowing', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Brook_sound.ogg' },
];

const MeditationTimer = () => {
  const { addMeditation, meditations } = useStore();
  const [duration, setDuration] = useState(10); // Default 10 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState(sounds[0]);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [duration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  // Audio Playback Logic
  useEffect(() => {
    if (audioRef.current) {
      // Update source if it changed
      if (audioRef.current.src !== selectedSound.url) {
        audioRef.current.src = selectedSound.url;
        audioRef.current.load(); // Reload to apply new source
      }

      if (isRunning && isMusicEnabled) {
        audioRef.current.play().catch(error => console.log("Audio play failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isRunning, isMusicEnabled, selectedSound]);


  const handleComplete = () => {
    setIsRunning(false);
    setIsCompleted(true);
    clearInterval(intervalRef.current);
    addMeditation(duration);

    // Play completion vibration (if available)
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    setTimeout(() => {
      setIsCompleted(false);
    }, 5000);
  };

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsCompleted(false);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (e) => {
    setDuration(parseInt(e.target.value));
  };

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress for circle
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const totalSessions = meditations?.length || 0;
  const totalMinutes = meditations?.reduce((sum, m) => sum + m.duration, 0) || 0;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6">Meditation Timer</h2>

      {/* Timer Display */}
      <div className="relative mb-8">
        {/* Progress Circle Background */}
        <svg className="transform -rotate-90 w-72 h-72">
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-200"
          />
          <circle
            cx="144"
            cy="144"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`text-indigo-500 transition-all duration-1000 ease-linear ${isCompleted ? 'text-green-500' : ''}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Time and Status Text */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          {isCompleted ? (
            <div className="animate-fade-in text-center">
              <div className="text-5xl mb-2">✨</div>
              <p className="text-2xl font-semibold text-indigo-600">Complete!</p>
            </div>
          ) : (
            <>
              <div className="text-5xl font-bold text-slate-700 font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="mt-2 text-slate-500 font-medium animate-pulse">
                {isRunning ? (isMusicEnabled ? '♫ Breathe...' : 'Breathe...') : 'Paused'}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sound Selection Controls */}
      <div className="w-full mb-6 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
            <Music size={16} />
            Ambiance
          </span>
          <button
            onClick={toggleMusic}
            className={`p-2 rounded-full transition-colors ${isMusicEnabled ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
            title={isMusicEnabled ? "Mute Music" : "Enable Music"}
          >
            {isMusicEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        <select
          value={selectedSound.id}
          onChange={(e) => setSelectedSound(sounds.find(s => s.id === e.target.value))}
          className="w-full p-2 text-sm border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-slate-50 text-slate-700"
          disabled={!isMusicEnabled && !isRunning}
        >
          {sounds.map(sound => (
            <option key={sound.id} value={sound.id}>
              {sound.name}
            </option>
          ))}
        </select>
        <audio ref={audioRef} loop />
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-8">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={isCompleted}
            className={`p-4 rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 ${isCompleted ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Play size={32} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="p-4 rounded-full bg-amber-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 hover:bg-amber-600"
          >
            <Pause size={32} fill="currentColor" />
          </button>
        )}

        <button
          onClick={handleReset}
          className="p-4 rounded-full bg-slate-200 text-slate-600 shadow-md transition-all hover:bg-slate-300 hover:text-slate-800"
          title="Reset Timer"
        >
          <RotateCcw size={24} />
        </button>
      </div>

      {/* Duration Selector */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-slate-600 font-medium">Duration:</span>
        <select
          value={duration}
          onChange={handleDurationChange}
          disabled={isRunning}
          className="p-2 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <option value={5}>5 min</option>
          <option value={10}>10 min</option>
          <option value={15}>15 min</option>
          <option value={20}>20 min</option>
          <option value={30}>30 min</option>
          <option value={45}>45 min</option>
          <option value={60}>60 min</option>
        </select>
      </div>

      {/* Stats */}
      {totalSessions > 0 && (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-indigo-500" />
            <h2 className="font-semibold text-slate-800">Your Progress</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {totalSessions}
              </div>
              <div className="text-sm text-slate-600">Sessions</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">
                {totalMinutes}
              </div>
              <div className="text-sm text-slate-600">Minutes</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm text-indigo-700 text-center font-medium">
              {totalSessions < 5
                ? "Great start! Keep it up! 🌟"
                : totalSessions < 10
                  ? "You're building a solid habit! 🔥"
                  : "Meditation master! 🧘‍♀️"
              }
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default MeditationTimer;
