const AppImage = ({ src, alt, ...rest }) => {
  if (!src) {
    console.error("Both 'src' and 'baseUrl' props are required.");
    return null;
  }
  console.log(rest)

  return <image src={src} alt={alt} {...rest} />;
};

export default AppImage;
