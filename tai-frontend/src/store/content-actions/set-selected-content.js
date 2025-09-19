export const setSelectedContent = (content, contentType, contentURL) => ({ setState }) => { 

    const newState = { selectedContent: content, selectedContentType: contentType, selectedContentURL: contentURL };

    setState(newState);

};