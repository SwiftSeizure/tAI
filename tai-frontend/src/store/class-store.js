import { createStore, createHook } from 'react-sweet-state';
import * as actions from './class-actions';

// Key for localStorage
export const CLASS_STORAGE_KEY = 'tai_class_state';

// Initial state
const initialState = {
  currentClass: null,     // Currently selected class
  classes: [],           // List of all user's classes
  isLoading: false,      // Loading state
  error: null,           // Error state
  lastUpdated: null      // Last update timestamp
};

// Load state from localStorage if available
export const loadClassState = () => {
  try {
    const serializedState = localStorage.getItem(CLASS_STORAGE_KEY);
    if (serializedState === null) return initialState;
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load class state from localStorage:', err);
    return initialState;
  }
};

// Create the class store
export const ClassStore = createStore({
  name: 'class',
  initialState: loadClassState(),
  actions,
});

// Create hooks
export const useClass = createHook(ClassStore); 

export const useCurrentClass = () => {
  const [state] = useClass();
  return { currentClass: state.currentClass };
};

export const useAllClasses = () => {
  const [state] = useClass();
  return { classes: state.classes };
};

export const useClassesLoading = () => {
  const [state] = useClass();
  return { isLoading: state.isLoading };
};

export const useClassesError = () => {
  const [state] = useClass();
  return { error: state.error };
};
