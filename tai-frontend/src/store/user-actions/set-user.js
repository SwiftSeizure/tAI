export const setUser = (userData) => ({ setState, getState }) => {
    const newState = {
      ...getState(),
      user: {
        ...getState().user,
        ...userData,
      },
      isAuthenticated: true,
      loading: false,
    };
    
    // Save to localStorage
    localStorage.setItem('tai_user_state', JSON.stringify(newState));
    
    setState(newState);
};