import api from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
                email,
                password,
            });

            const { access_token, expires_in } = response.data;

            // Guardar token en localStorage
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error de autenticación',
            };
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.AUTH.ME);
            const userData = response.data;

            // Guardar datos del usuario
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

            return { success: true, data: userData };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al obtener usuario',
            };
        }
    },

    logout: () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    },

    isAuthenticated: () => {
        return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    getStoredUser: () => {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    },
};