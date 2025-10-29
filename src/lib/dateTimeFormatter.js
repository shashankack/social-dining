// src/lib/dateTimeFormatter.js
// Helper to convert UTC date string to IST and format as DD.MM.YY | HH:MM AM/PM

export function formatToIST(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60; // in minutes
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const istDate = new Date(utc + istOffset * 60000);

  // Format DD.MM.YY
  const day = String(istDate.getDate()).padStart(2, '0');
  const month = String(istDate.getMonth() + 1).padStart(2, '0');
  const year = String(istDate.getFullYear()).slice(-2);

  // Format HH:MM AM/PM
  let hours = istDate.getHours();
  const minutes = String(istDate.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const hourStr = String(hours).padStart(2, '0');

  return `${day}.${month}.${year} | ${hourStr}:${minutes} ${ampm}`;
}
