

export const setSelectedDay = (day) => ({ setState, getState }) => {
    const newState = {
        ...getState(),
        selectedDay: day,
    };
    
    setState(newState);
    
    return day;
};