import { CLASS_STORAGE_KEY } from '../class-store';

export const setClasses = (newClasses) => ({ setState, getState }) => {
  const newState = {
    classes: Array.isArray(newClasses) ? newClasses : [],
    lastUpdated: Date.now(),
    error: null,
    isLoading: false
  };
  
  setState(newState);
  
  // Update localStorage
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify({
    ...getState(),
    ...newState
  }));
  
  return newClasses;
};
