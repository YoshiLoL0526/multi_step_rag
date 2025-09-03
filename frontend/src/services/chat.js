import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const chatService = {
    getConversations: async (documentId, skip = 0, limit = 100) => {
        try {
            const response = await api.get(API_ENDPOINTS.CHAT.CONVERSATIONS, {
                params: { document_id: documentId, skip, limit }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al obtener conversaciones',
            };
        }
    },

    createConversation: async (title, documentId) => {
        try {
            const response = await api.post(API_ENDPOINTS.CHAT.CONVERSATIONS, {
                title,
                document_id: documentId
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al crear conversación',
            };
        }
    },

    getConversation: async (conversationId) => {
        try {
            const response = await api.get(API_ENDPOINTS.CHAT.CONVERSATION(conversationId));
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al obtener conversación',
            };
        }
    },

    deleteConversation: async (conversationId) => {
        try {
            await api.delete(API_ENDPOINTS.CHAT.CONVERSATION(conversationId));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al eliminar conversación',
            };
        }
    },

    getMessages: async (conversationId, skip = 0, limit = 100) => {
        try {
            const response = await api.get(API_ENDPOINTS.CHAT.MESSAGES(conversationId), {
                params: { skip, limit }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al obtener mensajes',
            };
        }
    },

    sendMessage: async (conversationId, messageData) => {
        try {
            const response = await api.post(API_ENDPOINTS.CHAT.MESSAGES(conversationId), messageData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al enviar mensaje',
            };
        }
    },
};