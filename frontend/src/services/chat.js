import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const chatService = {
    // Obtener conversaciones de un documento
    getConversations: async (documentId, skip = 0, limit = 100) => {
        try {
            const response = await api.get(API_ENDPOINTS.CHAT.CONVERSATIONS, {
                params: { document_id: documentId, skip, limit }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al obtener conversaciones',
            };
        }
    },

    // Crear nueva conversación
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
                error: error.response?.data?.detail || 'Error al crear conversación',
            };
        }
    },

    // Obtener conversación específica
    getConversation: async (conversationId) => {
        try {
            const response = await api.get(API_ENDPOINTS.CHAT.CONVERSATION(conversationId));
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al obtener conversación',
            };
        }
    },

    // Eliminar conversación
    deleteConversation: async (conversationId) => {
        try {
            await api.delete(API_ENDPOINTS.CHAT.CONVERSATION(conversationId));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al eliminar conversación',
            };
        }
    },

    // Obtener mensajes de una conversación
    getMessages: async (conversationId, skip = 0, limit = 100) => {
        try {
            const response = await api.get(API_ENDPOINTS.CHAT.MESSAGES(conversationId), {
                params: { skip, limit }
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al obtener mensajes',
            };
        }
    },

    // Enviar mensaje
    sendMessage: async (conversationId, content) => {
        try {
            const response = await api.post(API_ENDPOINTS.CHAT.MESSAGES(conversationId), {
                content
            });
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Error al enviar mensaje',
            };
        }
    },
};