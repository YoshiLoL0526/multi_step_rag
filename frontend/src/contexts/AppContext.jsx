import { createContext, useContext, useState, useEffect } from 'react';

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

    useEffect(() => {
        if (selectedDocumentId) {
            setActiveConversationId(null);
        }
    }, [selectedDocumentId]);

    const selectDocument = (documentId) => {
        setSelectedDocumentId(documentId);
    };

    const selectConversation = (conversationId) => {
        setActiveConversationId(conversationId);
    };

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