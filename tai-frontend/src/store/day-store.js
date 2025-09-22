import { createStore, createHook } from 'react-sweet-state';
import * as actions from './day-actions';   

const initialState = {
    selectedDay: null,
}; 

export const DayStore = createStore({
    name: 'day',
    initialState,
    actions,
});

export const useDay = createHook(DayStore); 
