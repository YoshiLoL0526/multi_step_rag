import { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal debe ser usado dentro de ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState([]);

    const openModal = useCallback((modalConfig) => {
        const id = Date.now() + Math.random();

        const resolvedContent = typeof modalConfig.content === 'function'
            ? modalConfig.content(id)
            : modalConfig.content;

        const modal = {
            id,
            isOpen: true,
            ...modalConfig,
            content: resolvedContent
        };

        setModals(prev => [...prev, modal]);
        return id;
    }, []);

    const closeModal = useCallback((id) => {
        setModals(prev => prev.filter(modal => modal.id !== id));
    }, []);

    const closeAllModals = useCallback(() => {
        setModals([]);
    }, []);

    const updateModal = useCallback((id, updates) => {
        setModals(prev => prev.map(modal =>
            modal.id === id ? { ...modal, ...updates } : modal
        ));
    }, []);

    return (
        <ModalContext.Provider value={{
            modals,
            openModal,
            closeModal,
            closeAllModals,
            updateModal
        }}>
            {children}
        </ModalContext.Provider>
    );
};