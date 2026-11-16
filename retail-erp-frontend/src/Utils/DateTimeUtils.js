/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Format a date time string to a readable format
 * @param {string} dateTimeString - The date time string to format
 * @returns {string} - Formatted date time string
 */
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);
  return date.toLocaleString();
};

/**
 * Get the difference in days between two dates
 * @param {string} startDate - Start date
 * @param {string} endDate - End date
 * @returns {number} - Difference in days
 */
export const getDaysDifference = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Check if a date is in the past
 * @param {string} dateString - The date to check
 * @returns {boolean} - True if the date is in the past
 */
export const isDateInPast = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date < today;
};

/**
 * Check if a date is today
 * @param {string} dateString - The date to check
 * @returns {boolean} - True if the date is today
 */
export const isDateToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Format a date to YYYY-MM-DD format for input fields
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
};
