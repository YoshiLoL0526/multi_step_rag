import { useNotifications } from '../contexts/NotificationContext';
import { useCallback } from 'react';

export const useErrorHandler = () => {
    const { showError, showNetworkError } = useNotifications();

    const handleError = useCallback((result, customMessage) => {
        console.error('Error:', result.error);

        // Error de red
        if (!navigator.onLine || result.error === 'Failed to fetch') {
            return showNetworkError();
        }

        // Error HTTP
        if (result.error) {
            const status = result.status;
            const data = result.data;

            switch (status) {
                case 400:
                    return showError(data?.message || 'Datos inválidos');
                case 401:
                    return showError('Sesión expirada. Inicia sesión nuevamente');
                case 403:
                    return showError('No tienes permisos para realizar esta acción');
                case 404:
                    return showError('Recurso no encontrado');
                case 422:
                    return showError(data?.message || 'Error de validación');
                case 500:
                    return showError('Error interno del servidor');
                default:
                    return showError(customMessage || 'Ha ocurrido un error inesperado');
            }
        }

        // Error genérico
        return showError(customMessage || result.error || 'Ha ocurrido un error inesperado');
    }, [showError, showNetworkError]);

    return { handleError };
};