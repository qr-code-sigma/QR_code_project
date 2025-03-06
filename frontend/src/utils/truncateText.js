const truncate = (str = "", maxLen) => {
  if (!str || str.length <= maxLen) return str;

  const spaceDetection = str[maxLen - 1] === " " ? 1 : 0;
  return str.slice(0, maxLen - spaceDetection) + "...";
};

export default truncate;
