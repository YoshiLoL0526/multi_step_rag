import { useState, useEffect } from 'react';
import { documentsService } from '../services/documents';
import { useErrorHandler } from './useErrorHandler';
import { useNotifications } from '../contexts/NotificationContext';

export const useDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { handleError } = useErrorHandler();
    const { showSuccess } = useNotifications();

    const fetchDocuments = async () => {
        setLoading(true);
        const result = await documentsService.getDocuments();

        if (result.success) {
            setDocuments(result.data);
        }
        else {
            handleError(result, 'Error al obtener los documentos');
        }
        setLoading(false);

        return result;
    };

    const uploadDocument = async (file, onProgress = null) => {
        const result = await documentsService.uploadDocument(file, onProgress);

        if (result.success) {
            await fetchDocuments();
            showSuccess('Documento subido exitosamente');
        }
        else {
            handleError(result, 'Error al subir el documento');
        }

        return result;
    };

    const updateDocument = async (id, data) => {
        const result = await documentsService.updateDocument(id, data);

        if (result.success) {
            await fetchDocuments();
        }
        else {
            handleError(result, 'Error al actualizar el documento');
        }

        return result;

    };

    const deleteDocument = async (id) => {
        const result = await documentsService.deleteDocument(id);

        if (result.success) {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        }
        else {
            handleError(result, 'Error al eliminar el documento')
        }

        return result;
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return {
        documents,
        loading,
        fetchDocuments,
        uploadDocument,
        updateDocument,
        deleteDocument,
    };
};