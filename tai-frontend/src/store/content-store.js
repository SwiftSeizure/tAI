import { createStore, createHook } from 'react-sweet-state';  
import * as actions from './content-actions';

const initialState = { 
    selectedContent: null, 
    selectedContentTypeURL: null, 
}; 

export const ContentStore = createStore({
    name: 'content',
    initialState,
    actions,
});

export const useContent = createHook(ContentStore); 

export const useSelectedContent = () => {
    const [state] = useContent();
    return { selectedContent: state.selectedContent, selectedContentTypeURL: state.selectedContentTypeURL };
};

