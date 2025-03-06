const truncate = (str, maxLen) => {
  if (str) {
    const spaceDetection = str[maxLen - 1] === " " ? -2 : -1;
    return str.length > maxLen
      ? str.slice(0, maxLen - spaceDetection) + "..."
      : str;
  }
};

export default truncate;
