// hooks/useDocuments.js
import { useState, useEffect } from 'react';
import { documentsService } from '../services/documents';

export const useDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);

        const result = await documentsService.getDocuments();

        if (result.success) {
            setDocuments(result.data);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const uploadDocument = async (file, onProgress = null) => {
        setError(null);
        const result = await documentsService.uploadDocument(file, onProgress);

        if (result.success) {
            await fetchDocuments(); // Refrescar lista
            return result;
        } else {
            setError(result.error);
            return result;
        }
    };

    const updateDocument = async (id, data) => {
        setError(null);
        const result = await documentsService.updateDocument(id, data);

        if (result.success) {
            await fetchDocuments(); // Refrescar lista
        } else {
            setError(result.error);
        }

        return result;
    };

    const deleteDocument = async (id) => {
        setError(null);
        const result = await documentsService.deleteDocument(id);

        if (result.success) {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } else {
            setError(result.error);
        }

        return result;
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return {
        documents,
        loading,
        error,
        fetchDocuments,
        uploadDocument,
        updateDocument,
        deleteDocument,
        clearError: () => setError(null),
    };
};