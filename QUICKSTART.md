# 🚀 Quick Start Guide

## Installation Steps

1. **Extract the project** (if zipped)

2. **Navigate to project directory**:
```bash
cd habit-tracker
```

3. **Install dependencies**:
```bash
npm install
```

4. **Start development server**:
```bash
npm run dev
```

5. **Open your browser** to `http://localhost:3000`

## First Time Usage

### Creating Your First Habit
1. Go to "Habits" tab (home icon)
2. Type a habit name in the input field
3. Click the `+` button
4. Click the circle to check it off for today
5. Watch your streak grow! 🔥

### Logging Your Mood
1. Tap the "Mood" tab (heart icon)
2. Select an emoji that matches your mood
3. Optionally add a note
4. Tap "Save Mood"

### Starting Meditation
1. Tap "Meditate" tab (timer icon)
2. Choose duration (5, 10, or 15 minutes)
3. Tap "Start"
4. Watch the progress ring fill up
5. Meditate! 🧘

### Viewing Insights
1. Tap "Insights" tab (chart icon)
2. See your mood trends
3. Check habit completion rates
4. View overall statistics

## Tips for Best Experience

- ✅ Use on mobile for best experience (mobile-first design)
- 📱 Add to home screen for PWA-like experience (coming soon)
- 🔄 Data persists automatically in browser
- 🌙 Works offline (after first load)
- 🎨 Best viewed in Chrome, Safari, or Firefox

## Troubleshooting

**Nothing happens when clicking Start**:
- Make sure you've selected a duration first

**Charts are empty**:
- Add some data first! Track mood and complete habits

**Data disappeared**:
- Check if you cleared browser data/cache
- localStorage stores all data locally

**Styles look wrong**:
- Clear browser cache and hard reload (Ctrl+Shift+R)

## Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Files will be in `/dist` folder ready for deployment.

## Deploy

You can deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `/dist` folder
- **GitHub Pages**: Use `gh-pages` package
- **Any static hosting**: Upload `/dist` folder

Enjoy tracking! 🌟
