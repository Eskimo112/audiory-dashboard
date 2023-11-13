export const formatNumber = (value) => {
  const formattedValue = (Math.round(value * 10) / 10).toLocaleString('en-US');
  return `${formattedValue}`;
};

export const formatStatistic = (value) => {
  if (value === null || value === undefined) return '';
  if (value < 1000) {
    return value.toLocaleString();
  } else if (value >= 1000 && value < 1000000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else if (value >= 1000000 && value < 1000000000) {
    return (value / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else {
    return (value / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  }
};

export function countDiffenceFromNow(dateString) {
  const date = new Date(dateString);
  const now = Date.now();
  const diffTime = Math.abs(now - date);
  const diffInMinutes = Math.ceil(diffTime / (1000 * 60));
  const diffInHours = Math.ceil(diffTime / (1000 * 60 * 60));
  if (diffInMinutes < 1) {
    return diffInMinutes + ' giây trước';
  } else if (diffInHours < 1) {
    return diffInHours + ' phút trước';
  } else if (diffInHours <= 23) return diffInHours + ' giờ trước';
  return formatDate(dateString).split(' ')[0];
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formattedDate = `${day}-${month}-${year} lúc ${hours}:${minutes}`;
  return formattedDate;
}
