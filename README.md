# 🌸 Habit + Mood + Meditation Tracker

A beautiful, mobile-friendly wellness app built with React, Vite, and Tailwind CSS. Track your daily habits, log your mood, meditate with timers, and gain insights into your wellbeing patterns.

![App Preview](https://via.placeholder.com/800x400/fb7185/ffffff?text=Habit+Tracker)

## ✨ Features

### 📋 Dashboard (Habits)
- ✅ Add, edit, and delete custom habits
- ☑️ Check off daily completions with beautiful animations
- 🔥 Automatic streak tracking (current & best streaks)
- 📅 Mini 7-day calendar view showing completion history
- 💾 All data persists in localStorage

### 💭 Mood Logger
- 😊 5-point emoji scale for quick mood tracking
- 📝 Optional text notes for deeper reflection
- 📊 Recent mood history view
- 🎨 Color-coded mood states

### 🧘 Meditation Timer
- ⏱️ Preset durations: 5, 10, 15 minutes
- ⭕ Animated circular progress ring
- ▶️ Start, pause, and reset controls
- 📈 Session tracking and statistics
- ✨ Completion animations

### 📊 Insights
- 📉 Mood trend line chart (7/14/30 day views)
- 📊 Habit completion rate bar chart
- 📊 Overall stats: average mood, completion %, meditation time
- 💡 Smart insights based on your data
- 🎨 Beautiful, responsive charts using Recharts

## 🎨 Design Philosophy

**Aesthetic**: Warm minimalism with organic gradients
- Soft peach/coral gradients creating a wellness-focused atmosphere
- Smooth animations and micro-interactions
- Glass-morphism cards with backdrop blur
- Custom fonts: DM Serif Display (headers) + Inter (body)
- Mobile-first responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite (lightning-fast HMR)
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand (with localStorage persistence)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Storage**: LocalStorage (automatic via Zustand middleware)

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
habit-tracker/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main habits view
│   │   ├── MoodLogger.jsx         # Mood tracking interface
│   │   ├── MeditationTimer.jsx    # Timer with circular progress
│   │   ├── Insights.jsx           # Charts and analytics
│   │   └── Navigation.jsx         # Bottom tab navigation
│   ├── store/
│   │   └── useStore.js           # Zustand state + localStorage
│   ├── utils/
│   │   └── dateHelpers.js        # Date formatting utilities
│   ├── App.jsx                    # Main app component
│   ├── index.css                  # Tailwind + custom styles
│   └── main.jsx                   # Entry point
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🧩 Component Explanations

### Dashboard.jsx
**Purpose**: Main habits management interface

**Key Features**:
- Dynamic habit list with CRUD operations
- Checkbox toggle with animation
- Streak calculation algorithm (finds consecutive days)
- Mini calendar showing last 7 days of completions
- Progress bar showing daily completion percentage

**State Management**:
```javascript
const { habits, addHabit, deleteHabit, toggleHabit, editHabit, getHabitStreak } = useStore();
```

**Streak Algorithm**: Checks consecutive days backwards from today, comparing completion dates with expected dates.

---

### MoodLogger.jsx
**Purpose**: Daily mood tracking with emoji scale

**Key Features**:
- 5 mood levels with emoji + color coding
- Optional text note for context
- Auto-loads today's mood if already logged
- Recent mood history (last 7 entries)
- Visual feedback on save

**Mood Scale**:
1. 😞 Terrible (red)
2. 😕 Bad (orange)
3. 😐 Okay (yellow)
4. 🙂 Good (green)
5. 😄 Great (emerald)

---

### MeditationTimer.jsx
**Purpose**: Countdown timer with visual progress

**Key Features**:
- Three preset durations (5/10/15 min)
- Circular SVG progress ring
- Accurate countdown using `setInterval`
- Session completion tracking
- Vibration feedback on mobile (if supported)

**Timer Logic**:
```javascript
// Progress calculation
const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;
const circumference = 2 * Math.PI * 120;
const strokeDashoffset = circumference - (progress / 100) * circumference;
```

The `strokeDashoffset` creates the circular progress animation by adjusting the SVG stroke.

---

### Insights.jsx
**Purpose**: Data visualization and analytics

**Key Features**:
- Time range selector (7/14/30 days)
- Mood trend line chart (Recharts)
- Habit completion bar chart
- Summary statistics cards
- Smart insights based on patterns

**Charts**:
- **LineChart**: Shows mood fluctuations over time
- **BarChart**: Displays daily habit completion percentages
- Custom tooltips with formatted data

---

### Navigation.jsx
**Purpose**: Bottom tab navigation

**Key Features**:
- Fixed bottom positioning (mobile-friendly)
- Active state highlighting
- Icons from Lucide React
- Smooth transitions
- Glass-morphism effect

---

## 🗃️ State Management (Zustand)

### Why Zustand?
- **Minimal boilerplate**: No providers or reducers needed
- **Built-in persistence**: Automatic localStorage sync
- **Small bundle size**: ~1KB
- **Simple API**: `create()` and `useStore()`

### Store Structure

```javascript
{
  // Habits
  habits: [
    {
      id: 1707500000000,
      name: "Morning workout",
      createdAt: "2024-02-09T12:00:00.000Z",
      completions: ["2024-02-09", "2024-02-08", "2024-02-07"]
    }
  ],
  
  // Moods
  moods: [
    {
      date: "2024-02-09",
      mood: 4,
      note: "Feeling productive!"
    }
  ],
  
  // Meditations
  meditations: [
    {
      date: "2024-02-09T14:30:00.000Z",
      duration: 10,
      completed: true
    }
  ]
}
```

### Key Methods

- `addHabit(name)`: Creates new habit with timestamp ID
- `toggleHabit(id, date)`: Adds/removes date from completions array
- `getHabitStreak(id)`: Calculates current and best streak
- `addMood(mood, note)`: Saves/updates today's mood entry
- `addMeditation(duration)`: Records completed meditation session

---

## 🎨 Styling Approach

### Tailwind Configuration

Custom theme extends with:
- **Primary colors**: Rose/pink gradient palette
- **Accent colors**: Warm yellows
- **Custom fonts**: DM Serif Display + Inter
- **Animations**: fadeIn, slideUp, pulseSoft

### Key CSS Classes

```css
.glass-card {
  /* Glassmorphism effect */
  @apply bg-white/70 backdrop-blur-md border border-white/50 shadow-lg;
}

.btn-primary {
  /* Gradient button */
  @apply bg-gradient-to-r from-rose-400 to-pink-400 
         hover:from-rose-500 hover:to-pink-500 
         text-white font-medium px-6 py-3 rounded-full;
}

.text-gradient {
  /* Gradient text */
  @apply bg-gradient-to-r from-rose-500 to-pink-500 
         bg-clip-text text-transparent;
}
```

### Animation Strategy

- **Page enter**: `animate-slide-up` (translate + fade)
- **Staggered reveals**: `style={{ animationDelay: '100ms' }}`
- **Hover effects**: `scale-110` on interactive elements
- **Transitions**: `transition-all duration-200` for smooth changes

---

## 📱 Mobile Optimization

- **Responsive design**: Works on all screen sizes
- **Touch-friendly**: Large tap targets (48px minimum)
- **Bottom navigation**: Easy thumb reach
- **Fixed max-width**: 512px (optimal reading width)
- **No horizontal scroll**: Proper viewport settings

---

## 🔮 Future Enhancements (PWA)

To make this a full Progressive Web App:

1. **Install vite-plugin-pwa**:
```bash
npm install -D vite-plugin-pwa
```

2. **Update vite.config.js**:
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Habit Tracker',
        short_name: 'Habits',
        description: 'Track habits, mood, and meditation',
        theme_color: '#f43f5e',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

3. **Add icons** to `/public` folder
4. **Deploy** to HTTPS server (required for PWA)

---

## 🐛 Common Issues & Solutions

### Charts not rendering
- Make sure parent has defined height
- Recharts needs `ResponsiveContainer`

### LocalStorage quota exceeded
- Happens after ~5-10MB of data
- Implement data cleanup for old entries
- Consider IndexedDB for larger datasets

### Timer drift
- Current implementation uses `setInterval` (accurate enough for meditation)
- For precision, use `Date.now()` comparison instead

---

## 📝 License

MIT - Feel free to use this project for personal or commercial purposes!

---

## 🙏 Credits

- **Design**: Inspired by modern wellness apps
- **Fonts**: Google Fonts (DM Serif Display, Inter)
- **Icons**: Lucide React
- **Charts**: Recharts library

---

## 📧 Contact

Questions or suggestions? Feel free to reach out!

**Happy tracking! 🌟**
