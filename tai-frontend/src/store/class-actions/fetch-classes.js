import { getClasses } from '../../shared/services/get-classes';
import { CLASS_STORAGE_KEY } from '../class-store';

export const fetchClasses = (userId, role) => async ({ setState, getState }) => {
  try {
    // Set loading state
    setState({
      ...getState(),
      isLoading: true,
      error: null
    });
    
    // Make the API call
    const classes = await getClasses(userId, role);
    
    // Update the state with the fetched classes
    const newState = {
      ...getState(),
      classes: classes || [],
      lastUpdated: Date.now(),
      isLoading: false,
      error: null
    };
    
    setState(newState);
    
    // Save to localStorage
    localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(newState));
    
    return classes;
  } catch (error) {
    // Set error state if the request fails
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch classes';
    const errorState = {
      ...getState(),
      isLoading: false,
      error: errorMessage
    };
    
    setState(errorState);
    localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(errorState));
    
    throw error;
  }
};
