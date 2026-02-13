# 🏗️ Technical Architecture & Explanations

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                React Application                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │   │
│  │  │Dashboard │  │  Mood    │  │Meditation│         │   │
│  │  │          │  │  Logger  │  │  Timer   │         │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘         │   │
│  │       │             │             │                 │   │
│  │       └─────────────┼─────────────┘                │   │
│  │                     │                               │   │
│  │              ┌──────▼──────┐                       │   │
│  │              │   Zustand   │                       │   │
│  │              │    Store    │                       │   │
│  │              └──────┬──────┘                       │   │
│  │                     │                               │   │
│  │              ┌──────▼──────┐                       │   │
│  │              │ localStorage│                       │   │
│  │              └─────────────┘                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Adding a Habit
```
User Input → Component State → Zustand Action → Store Update → localStorage Sync → UI Re-render
```

### Toggling Habit Completion
```
User Click → toggleHabit(id, date) → Update completions array → 
Recalculate streak → Update UI → Persist to localStorage
```

### Meditation Timer Flow
```
Select Duration → Start Timer → setInterval Loop → 
Decrement timeLeft → Update Progress Ring → 
On Complete → Save to Store → Show Success Animation
```

## Component Architecture

### 1. Dashboard Component
**Responsibility**: Habits CRUD + Visualization

**Internal State**:
- `newHabit`: Input field value
- `editingId`: Currently editing habit ID
- `editText`: Edit input value

**Store Dependencies**:
- `habits`: Array of all habits
- `addHabit()`: Create new habit
- `deleteHabit()`: Remove habit
- `toggleHabit()`: Toggle completion for date
- `editHabit()`: Update habit name
- `getHabitStreak()`: Calculate streak stats

**Key Algorithm - Streak Calculation**:
```javascript
getHabitStreak: (habitId) => {
  // 1. Get habit completions (sorted dates)
  // 2. Start from today, check backward
  // 3. Count consecutive days
  // 4. Break on first gap
  // 5. Also find longest historical streak
  // Returns: { current: number, best: number }
}
```

**Sub-Components**:
- `MiniCalendar`: Shows last 7 days with completion status

---

### 2. MoodLogger Component
**Responsibility**: Daily mood tracking

**Internal State**:
- `selectedMood`: Current selection (1-5)
- `note`: Optional text note
- `saved`: Success feedback flag

**Store Dependencies**:
- `moods`: Array of mood entries
- `addMood()`: Save/update today's mood
- `getTodayMood()`: Retrieve today's entry

**Mood Data Structure**:
```javascript
{
  date: "2024-02-09",     // ISO date string
  mood: 4,                // 1-5 scale
  note: "Great day!"      // Optional string
}
```

**Key Features**:
- Auto-loads existing mood on mount
- Updates existing entry if logging again
- Visual feedback with scale-up animation
- Color-coded mood states

---

### 3. MeditationTimer Component
**Responsibility**: Countdown timer with progress visualization

**Internal State**:
- `selectedDuration`: Minutes (5, 10, 15)
- `timeLeft`: Remaining seconds
- `isRunning`: Timer active state
- `isComplete`: Completion animation trigger

**Timer Logic**:
```javascript
useEffect(() => {
  if (isRunning && timeLeft > 0) {
    interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleComplete();  // Save session
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }
  return () => clearInterval(interval);
}, [isRunning, timeLeft]);
```

**SVG Progress Ring**:
```javascript
// Circle has circumference based on radius (120px)
const circumference = 2 * Math.PI * 120;

// Calculate progress as percentage
const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

// Adjust dash offset to create progress effect
const strokeDashoffset = circumference - (progress / 100) * circumference;

// Apply to SVG circle
<circle
  strokeDasharray={circumference}
  strokeDashoffset={strokeDashoffset}
/>
```

---

### 4. Insights Component
**Responsibility**: Data visualization & analytics

**Internal State**:
- `timeRange`: Days to show (7, 14, 30)

**Data Processing**:

```javascript
// Mood Data Preparation
getMoodData = () => {
  const days = getLastNDays(timeRange);
  return days.map(date => ({
    date: formatDate(date),
    mood: moods.find(m => m.date === date)?.mood || null
  }));
}

// Habit Completion Data
getHabitData = () => {
  const days = getLastNDays(timeRange);
  return days.map(date => {
    const completed = habits.filter(h => 
      h.completions?.includes(date)
    ).length;
    const total = habits.length;
    return {
      date: formatDate(date),
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  });
}
```

**Recharts Integration**:
- `ResponsiveContainer`: Auto-adjusts to parent width
- `LineChart` + `Line`: Mood trends
- `BarChart` + `Bar`: Habit completion
- Custom tooltips for better UX

---

### 5. Navigation Component
**Responsibility**: Bottom tab navigation

**Props**:
- `activeTab`: Current active tab ID
- `setActiveTab`: Function to change tab

**Tab Configuration**:
```javascript
const tabs = [
  { id: 'dashboard', icon: Home, label: 'Habits' },
  { id: 'mood', icon: Heart, label: 'Mood' },
  { id: 'meditation', icon: Timer, label: 'Meditate' },
  { id: 'insights', icon: BarChart3, label: 'Insights' },
];
```

**Mobile Optimization**:
- Fixed bottom position
- 48px minimum touch targets
- Active state with scale animation
- Glass-morphism background

---

## State Management Deep Dive

### Zustand Store Structure

```javascript
create(
  persist(
    (set, get) => ({
      // State
      habits: [],
      moods: [],
      meditations: [],
      
      // Actions
      addHabit: (name) => set(state => ({...})),
      toggleHabit: (id, date) => set(state => ({...})),
      // ... more actions
      
      // Computed/Getters
      getHabitStreak: (id) => {
        const habit = get().habits.find(h => h.id === id);
        // ... calculation logic
        return { current, best };
      }
    }),
    { name: 'habit-tracker-storage' }  // localStorage key
  )
)
```

### Why Zustand Over Redux/Context?

**Advantages**:
1. **No Provider Hell**: Direct store import
2. **Minimal Boilerplate**: No reducers/actions separation
3. **Built-in Persistence**: `persist` middleware
4. **Performance**: Only re-renders consuming components
5. **Size**: ~1KB vs Redux ~3KB

**Example Usage**:
```javascript
// In component
const { habits, addHabit } = useStore();

// Can destructure only what's needed
const habits = useStore(state => state.habits);
```

---

## Performance Optimizations

### 1. Lazy Rendering
```javascript
// Only render active tab
const renderContent = () => {
  switch (activeTab) {
    case 'dashboard': return <Dashboard />;
    // Other tabs only mount when active
  }
};
```

### 2. Staggered Animations
```javascript
// Prevents layout thrashing
<div 
  style={{ animationDelay: `${index * 50}ms` }}
  className="animate-slide-up"
/>
```

### 3. Optimized Re-renders
Zustand only triggers re-renders in components that access changed state:
```javascript
// This component only re-renders when habits change
const habits = useStore(state => state.habits);
```

### 4. Date Calculations
Computed values cached in functions:
```javascript
// Called on-demand, not stored in state
getHabitStreak: (habitId) => { /* ... */ }
```

---

## Styling Architecture

### Tailwind Strategy

**Component Classes** (in index.css):
```css
@layer components {
  .glass-card {
    /* Reusable glass-morphism */
  }
  .btn-primary {
    /* Consistent button styles */
  }
}
```

**Utility Classes** (in components):
```jsx
<div className="bg-white/70 backdrop-blur-md rounded-2xl p-6">
  {/* Direct Tailwind utilities */}
</div>
```

### Custom Properties
```css
:root {
  --color-primary: #fb7185;
  --color-accent: #f472b6;
}
```

### Animation System

**CSS Keyframes**:
```css
@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

**Tailwind Config**:
```javascript
animation: {
  'slide-up': 'slideUp 0.3s ease-out'
}
```

**Usage**:
```jsx
<div className="animate-slide-up">Content</div>
```

---

## Data Persistence

### LocalStorage Strategy

**Automatic Sync** via Zustand:
```javascript
persist(
  storeConfig,
  { name: 'habit-tracker-storage' }
)
```

**Storage Format**:
```json
{
  "state": {
    "habits": [...],
    "moods": [...],
    "meditations": [...]
  },
  "version": 0
}
```

**Limits**:
- ~5MB per domain (varies by browser)
- Synchronous API (blocking)
- String-only storage (JSON.stringify/parse)

**Future: IndexedDB Migration**
For larger datasets:
```javascript
// More storage (50MB+)
// Async API
// Better for binary data
```

---

## Accessibility Considerations

### Current Implementation
- ✅ Semantic HTML (`<button>`, `<form>`)
- ✅ Keyboard navigation (tab through inputs)
- ✅ Touch targets (48px minimum)
- ✅ Color contrast (WCAG AA)

### Future Improvements
- [ ] ARIA labels for icons
- [ ] Screen reader announcements
- [ ] Keyboard shortcuts
- [ ] Focus trap in modals
- [ ] Reduced motion support

---

## Testing Strategy (Recommended)

### Unit Tests
```javascript
// Example with Vitest
describe('getHabitStreak', () => {
  it('calculates current streak correctly', () => {
    const store = createStore();
    // Test streak logic
  });
});
```

### Integration Tests
```javascript
// Example with React Testing Library
test('adding a habit updates the list', () => {
  render(<Dashboard />);
  // Simulate user interactions
  // Assert UI updates
});
```

### E2E Tests
```javascript
// Example with Playwright
test('complete user flow', async ({ page }) => {
  // Add habit → Check off → View insights
});
```

---

## Bundle Size Analysis

**Production Build**:
```bash
npm run build
```

**Expected Sizes**:
- React + React-DOM: ~130KB
- Zustand: ~1KB
- Recharts: ~95KB
- Lucide Icons: ~10KB (tree-shaken)
- App Code: ~30KB
- **Total**: ~270KB (gzipped: ~90KB)

---

## Browser Compatibility

**Supported**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Used**:
- CSS Grid/Flexbox
- CSS Variables
- ES6+ JavaScript
- Local Storage API
- SVG animations

---

## Security Considerations

### Current (Client-Side Only)
- ✅ No backend = No API vulnerabilities
- ✅ Data stays on user's device
- ✅ No sensitive data transmission

### If Adding Backend
- [ ] Encrypt data in transit (HTTPS)
- [ ] Sanitize user inputs
- [ ] Implement rate limiting
- [ ] Use secure authentication (JWT)
- [ ] CORS configuration

---

## Deployment Checklist

- [x] Production build works (`npm run build`)
- [x] No console errors
- [x] Mobile responsive
- [ ] Add favicon
- [ ] Add meta tags (SEO)
- [ ] Set up analytics
- [ ] Configure CSP headers
- [ ] Add error boundary
- [ ] Set up monitoring

---

This architecture provides a solid foundation that's:
- **Scalable**: Easy to add new features
- **Maintainable**: Clear separation of concerns
- **Performant**: Optimized rendering
- **Testable**: Pure functions and isolated components
