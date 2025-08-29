export const setUserLoading = (loading) => ({ setState, getState }) => {
  setState({
    ...getState(),
    loading,
  });
};

export const setUserError = (error) => ({ setState, getState }) => {
  setState({
    ...getState(),
    error,
    loading: false,
  });
};
