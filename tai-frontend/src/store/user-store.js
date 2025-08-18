import { createStore, createHook } from 'react-sweet-state';
import * as actions from './user-actions';

// Key for localStorage
export const USER_STORAGE_KEY = 'tai_user_state';

// Initial user state
const initialState = {
  user: {
    id: null,
    name: null,
    role: null, // 'teacher' or 'student'
    email: null,
    profilePicture: null,
    token: null, // For JWT if using authentication
  },
  isAuthenticated: false,
  loading: false,
  error: null,
}; 

// Load user from localStorage if available
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(USER_STORAGE_KEY);
    if (serializedState === null) return initialState;
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Failed to load user state from localStorage:', err);
    return initialState;
  }
};

// Create the user store
export const UserStore = createStore({
  name: 'user', 
  initialState: loadState(),
  actions,
});

// Create a hook to use the user store
export const useUser = createHook(UserStore);

// Create a hook to get the current user
export const useCurrentUser = () => {
  const [state] = useUser();
  return { user: state.user };
};

// Create a hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const [state] = useUser();
  return { isAuthenticated: state.isAuthenticated };
};

// Create a hook to get loading state
export const useUserLoading = () => {
  const [state] = useUser();
  return { isLoading: state.loading };
};

// Create a hook to get error state
export const useUserError = () => {
  const [state] = useUser();
  return { error: state.error };
};

// Create a hook to get all user actions
export const useUserActions = () => {
  const [, { setUser, clearUser, setLoading, setError }] = useUser();
  return { setUser, clearUser, setLoading, setError };
};