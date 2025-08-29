import { CLASS_STORAGE_KEY } from '../class-store';

export const setClassError = (error) => ({ setState, getState }) => {
  const newState = {
    error,
    isLoading: false
  };
  
  setState(newState);
  
  // Update localStorage
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify({
    ...getState(),
    ...newState
  }));
  
  return error;
};
