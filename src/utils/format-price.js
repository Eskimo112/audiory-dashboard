export const formatPrice = (value) => {
  const formattedValue = value.toLocaleString("en-US");
  return `${formattedValue}₫`;
};
