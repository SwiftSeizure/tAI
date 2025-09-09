export const clearUser = () => ({ setState }) => {
    // Clear from localStorage
    localStorage.removeItem('tai_user_state');
    
    setState({
      user: {
        id: null,
        name: null,
        role: null,
        email: null,
        profilePicture: null,
        token: null,
      },
      isAuthenticated: false,
      loading: false,
      error: null,
    });
};