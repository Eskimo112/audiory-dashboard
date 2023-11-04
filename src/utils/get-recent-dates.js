const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getRecentDates = (daysAgo) => {
  const currentDate = new Date();
  const recentDate = new Date(currentDate);
  recentDate.setDate(currentDate.getDate() - daysAgo);

  const todayString = formatDate(currentDate);
  const daysAgoString = formatDate(recentDate);

  return [daysAgoString, todayString];
};

export const getPastDates = (startDate, endDate) => {
  const pastEndDate = new Date(startDate);
  pastEndDate.setDate(pastEndDate.getDate() - 1);
  const pastStartDate = new Date(
    pastEndDate - (new Date(endDate) - new Date(startDate)),
  );
  return [formatDate(pastStartDate), formatDate(pastEndDate)];
};
