import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import MoodLogger from './components/MoodLogger';
import MeditationTimer from './components/MeditationTimer';
import Insights from './components/Insights';
import Navigation from './components/Navigation';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'mood':
        return <MoodLogger />;
      case 'meditation':
        return <MeditationTimer />;
      case 'insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen">
      <main className="pb-20">
        {renderContent()}
      </main>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
