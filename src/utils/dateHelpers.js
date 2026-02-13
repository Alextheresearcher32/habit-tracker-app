export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatFullDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
};

export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDateString = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

export const getLastNDays = (n) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const isToday = (dateString) => {
  return dateString === getTodayString();
};

export const isSameDay = (date1, date2) => {
  return getDateString(date1) === getDateString(date2);
};
