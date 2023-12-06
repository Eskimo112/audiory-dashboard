import dayjs from 'dayjs';

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

export const countDiffenceFromNow = (dateString) => {
  console.log(dateString);
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diffTime = Math.abs(now - date);
  const diffInMinutes = Math.ceil(diffTime / (1000 * 60));
  const diffInHours = Math.ceil(diffTime / (1000 * 60 * 60));

  console.log('---------------------');
  console.log('diffTime ', diffTime);
  console.log('diffTime ', diffInMinutes);
  console.log('diffTime ', diffInHours);
  // if (diffInMinutes < 1) {
  //   console.log('sec')
  //   return diffInMinutes + ' giây trước';
  // } else if (diffInHours < 1) {
  //   console.log('min')

  //   return diffInHours + ' phút trước';
  // } else if (diffInHours <= 23) {
  //   console.log('hour')
  //   return diffInHours + ' giờ trước'
  // };
  console.log(formatDate(dateString));
  return 'Cập nhật' + formatDateTime(dateString).split(',')[1];
};

export function timeAgo(dateString) {
  const currentDate = new Date();
  const inputDate = new Date(dateString);

  const timeDifference = currentDate - inputDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return years + ' năm trước';
  } else if (months > 0) {
    return months + ' tháng trước';
  } else if (days > 0) {
    return days + ' ngày trước';
  } else if (hours > 0) {
    return hours + ' giờ trước';
  } else if (minutes > 0) {
    return minutes + ' phút trước';
  } else if (seconds > 10) {
    return seconds + ' giây trước';
  } else {
    return 'Vừa xong';
  }
}

export function formatDateTime(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formattedDate = ` ${hours}:${minutes}, ${day}-${month}-${year}`;
  return formattedDate;
}

export function formatDate(dateString) {
  return dayjs(dateString).format('DD/MM/YYYY');
}
