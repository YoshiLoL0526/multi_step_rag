import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const documentsService = {
    getDocuments: async () => {
        try {
            const response = await api.get(API_ENDPOINTS.DOCUMENTS.LIST);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al obtener documentos',
            };
        }
    },

    uploadDocument: async (file, onProgress = null) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            if (onProgress) {
                config.onUploadProgress = (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                };
            }

            const response = await api.post(API_ENDPOINTS.DOCUMENTS.UPLOAD, formData, config);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al subir documento',
            };
        }
    },

    getDocument: async (id) => {
        try {
            const response = await api.get(API_ENDPOINTS.DOCUMENTS.GET(id));
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al obtener documento',
            };
        }
    },

    updateDocument: async (id, data) => {
        try {
            const response = await api.put(API_ENDPOINTS.DOCUMENTS.UPDATE(id), data);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al actualizar documento',
            };
        }
    },

    deleteDocument: async (id) => {
        try {
            await api.delete(API_ENDPOINTS.DOCUMENTS.DELETE(id));
            return { success: true };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                error: error.response?.data?.detail || 'Error al eliminar documento',
            };
        }
    },
};