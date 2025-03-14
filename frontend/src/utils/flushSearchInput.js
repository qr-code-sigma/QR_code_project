const flushSearchInput = () => {
  localStorage.removeItem("SEARCH_INPUT");
  localStorage.removeItem("CURRENT_PAGE");
  location.reload();
};

export default flushSearchInput;
