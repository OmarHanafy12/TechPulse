// A mapping from month names to numbers (0-indexed for JavaScript)
const monthMap = {
  "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
  "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
};

// This function safely converts "Month Year" strings to a reliable Date object
export const parseMonthYear = (dateString) => {
  if (!dateString || typeof dateString !== 'string') {
    return null;
  }
  
  const parts = dateString.split(' ');
  if (parts.length !== 2) {
    const fallbackDate = new Date(dateString);
    return isNaN(fallbackDate.getTime()) ? null : fallbackDate;
  }
  
  const monthName = parts[0];
  const year = parseInt(parts[1], 10);
  const month = monthMap[monthName];

  if (month === undefined || isNaN(year)) {
    return null;
  }

  return new Date(year, month, 1);
};