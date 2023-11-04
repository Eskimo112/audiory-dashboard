export const formatNumber = (value) => {
  const formattedValue = value.toLocaleString('en-US');
  return `${formattedValue}`;
};

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
