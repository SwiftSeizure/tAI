export const setSelectedContent = (content, contentURL) => ({ setState }) => { 

    const newState = { selectedContent: content, selectedContentTypeURL: contentURL };

    setState(newState);

};