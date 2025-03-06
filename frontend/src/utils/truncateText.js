const truncate = (str, maxLen) => {
  if (str) {
    return str.length > maxLen ? str.slice(0, maxLen - 1) + "..." : str;
  }
};

export default truncate;
