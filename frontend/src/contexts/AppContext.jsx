import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

    const selectDocument = useCallback((documentId) => {
        setSelectedDocumentId(documentId);
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
            }}
        >
            {children}
        </AppContext.Provider>
    );
};