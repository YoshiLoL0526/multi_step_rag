import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext debe ser usado dentro de AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const selectDocument = useCallback((documentId) => {
        setSelectedDocumentId(documentId);
        setActiveConversationId(null)
    }, []);

    const selectConversation = useCallback((conversationId) => {
        setActiveConversationId(conversationId);
    }, [setActiveConversationId]);

    return (
        <AppContext.Provider
            value={{
                selectedDocumentId,
                setSelectedDocumentId,
                selectDocument,
                activeConversationId,
                setActiveConversationId,
                selectConversation,
                conversations, setConversations,
                messages, setMessages,
                loading, setLoading
            }}
        >
            {children}
        </AppContext.Provider>
    );
};