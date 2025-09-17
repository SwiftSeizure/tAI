export const setCurrentChat = (chatId) => ({ setState }) => {
    setState({
        currentChatId: chatId // This is going to be the same thing as the material.id or the assignment.id
    });
};