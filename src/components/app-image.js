const AppImage = ({ src, alt, ...rest }) => {
  if (!src) {
    console.error("Both 'src' and 'baseUrl' props are required.");
    return null;
  }

  return <image src={src} alt={alt} {...rest} />;
};

export default AppImage;
