let reloadTimeoutId;

export const setReloadTimeout = () => {
  // Clear any existing timeout
  clearTimeout(reloadTimeoutId);

  // Set a new timeout to reload the page after 30 seconds
  reloadTimeoutId = setTimeout(() => {
    window.location.reload(true);
    console.log("No data received for 30 seconds. Reloading the page.");
  }, 40000); // 30 seconds
};

export const clearReloadTimeout = () => {
  clearTimeout(reloadTimeoutId);
};