import { createStore, createHook } from 'react-sweet-state';  
import * as actions from './content-actions';

const initialState = { 
    selectedContent: null,
    selectedContentType: null,
    selectedContentURL: null, 
}; 

export const ContentStore = createStore({
    name: 'content',
    initialState,
    actions,
});

export const useContent = createHook(ContentStore); 

export const useSelectedContent = () => {
    const [state, actions] = useContent();
    return { 
        ...state,
        ...actions
    };
};

