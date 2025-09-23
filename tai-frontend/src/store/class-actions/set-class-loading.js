import { CLASS_STORAGE_KEY } from '../class-store';

export const setClassLoading = (isLoading) => ({ setState, getState }) => {
  const newState = { isLoading };
  setState(newState);
  
  // Update localStorage
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify({
    ...getState(),
    ...newState
  }));
  
  return isLoading;
};
