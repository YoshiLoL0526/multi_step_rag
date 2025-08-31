import { createContext, useContext, useState } from 'react';

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

    return (
        <AppContext.Provider
            value={{
                selectedDocumentId,
                setSelectedDocumentId,
                activeConversationId,
                setActiveConversationId,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};