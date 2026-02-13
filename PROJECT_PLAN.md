# Habit + Mood + Meditation App - Project Plan

## Project Structure

```
habit-tracker/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main habits view with calendar
│   │   ├── MoodLogger.jsx         # Emoji mood tracker
│   │   ├── MeditationTimer.jsx    # Countdown timer with ring
│   │   ├── Insights.jsx           # Charts and analytics
│   │   └── Navigation.jsx         # Bottom tab navigation
│   ├── store/
│   │   └── useStore.js           # Zustand state management
│   ├── utils/
│   │   └── dateHelpers.js        # Date formatting utilities
│   ├── App.jsx                    # Main app component
│   ├── index.css                  # Tailwind + custom styles
│   └── main.jsx                   # App entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand (lightweight, no boilerplate)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: LocalStorage (via Zustand persist)
- **PWA**: Ready for manifest.json + service worker

## Features Breakdown

### 1. Dashboard (Habits)
- Add/edit/delete habits
- Check off daily completions
- Streak counter (current & best)
- Mini calendar view showing completion history
- Persistent data in localStorage

### 2. Mood Logger
- 5-point emoji scale (😞 😕 😐 🙂 😄)
- Optional text note
- Daily mood entry
- History view

### 3. Meditation Timer
- Preset durations: 5, 10, 15 minutes
- Circular progress ring animation
- Start/pause/reset controls
- Session completion tracking

### 4. Insights
- Mood trend over time (line chart)
- Habit completion rate (bar chart)
- 7-day and 30-day views
- Correlation hints

## Design Aesthetic

**Theme**: Warm minimalism with organic gradients
- Soft peach/coral gradients for wellness vibe
- Rounded, friendly UI elements
- Smooth animations and transitions
- Mobile-first responsive design
- Dark mode support via Tailwind

## Installation & Run

```bash
npm install
npm run dev
```

## Future PWA Setup

1. Add `vite-plugin-pwa` to vite.config.js
2. Create manifest.json with app metadata
3. Add service worker for offline support
4. Configure icons for home screen
