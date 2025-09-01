import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const addNotification = useCallback((notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: 'error',
            duration: 5000,
            ...notification,
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto-remove después del duration
        if (newNotification.duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }, [removeNotification]);

    // Métodos de conveniencia
    const showError = useCallback((message, options = {}) => {
        return addNotification({
            type: 'error',
            title: 'Error',
            message,
            ...options,
        });
    }, [addNotification]);

    const showNetworkError = useCallback(() => {
        return addNotification({
            type: 'error',
            title: 'Sin conexión',
            message: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
            duration: 0, // No auto-remove
        });
    }, [addNotification]);

    const showSuccess = useCallback((message, options = {}) => {
        return addNotification({
            type: 'success',
            title: 'Éxito',
            message,
            duration: 3000,
            ...options,
        });
    }, [addNotification]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            removeNotification,
            clearAll,
            showError,
            showNetworkError,
            showSuccess,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};