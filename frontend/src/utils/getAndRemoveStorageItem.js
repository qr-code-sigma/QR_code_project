const getAndRemoveStorageItem = (key) => {
  const value = localStorage.getItem(key);
  if (value) localStorage.removeItem(key);

  return value;
};

export default getAndRemoveStorageItem;
