import { getUnits } from '../../unit/services/get-units'; 
import { UNIT_STORAGE_KEY } from '../unit-store';

export const fetchUnits = (classID) => async ({ setState, getState }) => {
    try {
        setState({
            ...getState(),
            isLoading: true,
            error: null
        });

        const units = await getUnits(classID); 
        const newState = {
            ...getState(),
            units: units || [],
            lastUpdated: Date.now(),
            isLoading: false,
            error: null
        };  
        setState(newState);
        localStorage.setItem(UNIT_STORAGE_KEY, JSON.stringify(newState));
        return units;
    } catch (error) {
        console.error('Error fetching units:', error);
        const errorState = {
            ...getState(),
            isLoading: false,
            error: error.response?.data?.message || error.message || 'Failed to fetch units'
        };
        setState(errorState);
        localStorage.setItem(UNIT_STORAGE_KEY, JSON.stringify(errorState));
        throw error;
    }
};