import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // Habits
      habits: [],
      addHabit: (habit) => set((state) => ({ 
        habits: [...state.habits, { 
          id: Date.now(), 
          name: habit, 
          createdAt: new Date().toISOString(),
          completions: [] // Array of date strings
        }] 
      })),
      deleteHabit: (id) => set((state) => ({ 
        habits: state.habits.filter(h => h.id !== id) 
      })),
      toggleHabit: (id, date) => set((state) => ({
        habits: state.habits.map(habit => {
          if (habit.id === id) {
            const completions = habit.completions || [];
            const isCompleted = completions.includes(date);
            return {
              ...habit,
              completions: isCompleted 
                ? completions.filter(d => d !== date)
                : [...completions, date]
            };
          }
          return habit;
        })
      })),
      editHabit: (id, newName) => set((state) => ({
        habits: state.habits.map(h => h.id === id ? { ...h, name: newName } : h)
      })),

      // Mood tracking
      moods: [], // { date, mood: 1-5, note }
      addMood: (mood, note) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const existingIndex = state.moods.findIndex(m => m.date === today);
        const newMoods = [...state.moods];
        
        if (existingIndex >= 0) {
          newMoods[existingIndex] = { date: today, mood, note };
        } else {
          newMoods.push({ date: today, mood, note });
        }
        
        return { moods: newMoods };
      }),

      // Meditation sessions
      meditations: [], // { date, duration, completed }
      addMeditation: (duration) => set((state) => ({
        meditations: [...state.meditations, {
          date: new Date().toISOString(),
          duration,
          completed: true
        }]
      })),

      // Get stats
      getHabitStreak: (habitId) => {
        const habit = get().habits.find(h => h.id === habitId);
        if (!habit || !habit.completions || habit.completions.length === 0) {
          return { current: 0, best: 0 };
        }

        const sortedDates = [...habit.completions].sort().reverse();
        let currentStreak = 0;
        let bestStreak = 0;
        let tempStreak = 0;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calculate current streak
        for (let i = 0; i < sortedDates.length; i++) {
          const date = new Date(sortedDates[i]);
          date.setHours(0, 0, 0, 0);
          const expectedDate = new Date(today);
          expectedDate.setDate(expectedDate.getDate() - currentStreak);
          
          if (date.getTime() === expectedDate.getTime()) {
            currentStreak++;
          } else {
            break;
          }
        }

        // Calculate best streak
        for (let i = 0; i < sortedDates.length; i++) {
          if (i === 0) {
            tempStreak = 1;
          } else {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              tempStreak++;
            } else {
              bestStreak = Math.max(bestStreak, tempStreak);
              tempStreak = 1;
            }
          }
        }
        bestStreak = Math.max(bestStreak, tempStreak);

        return { current: currentStreak, best: bestStreak };
      },

      getTodayMood: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().moods.find(m => m.date === today);
      }
    }),
    {
      name: 'habit-tracker-storage',
    }
  )
);

export default useStore;
