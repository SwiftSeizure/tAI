export const setCurrentChat = (chatId) => ({ setState }) => {
    setState({
        currentChatId: chatId
    });
};