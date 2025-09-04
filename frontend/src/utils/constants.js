export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        ME: '/api/auth/me',
    },
    DOCUMENTS: {
        LIST: '/api/documents/',
        UPLOAD: '/api/documents/upload',
        GET: (id) => `/api/documents/${id}`,
        DELETE: (id) => `/api/documents/${id}`,
        UPDATE: (id) => `/api/documents/${id}`,
    },
    CHAT: {
        CONVERSATIONS: '/api/chat/conversations/',
        CONVERSATION: (id) => `/api/chat/conversations/${id}`,
        MESSAGES: (conversationId) => `/api/chat/conversations/${conversationId}/messages/`,
    },
    HEALTH: '/api/misc/health',
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    USER_DATA: 'user_data',
};

export const SUPPORTED_FILE_TYPES = {
    'application/pdf': '.pdf',
    'text/plain': '.txt',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/markdown': '.md'
};