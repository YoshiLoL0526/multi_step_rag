import { useState, useEffect, useCallback } from 'react';
import { documentsService } from '../services/documents';
import { useErrorHandler } from './useErrorHandler';
import { useNotifications } from '../contexts/NotificationContext';
import { useAppContext } from '../contexts/AppContext'

export const useDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const { handleError } = useErrorHandler();
    const { showSuccess } = useNotifications();
    const { selectDocument, selectedDocumentId, setSelectedDocumentId } = useAppContext()

    const fetchDocuments = useCallback(async () => {
        setLoading(true);
        const result = await documentsService.getDocuments();

        if (result.success) {
            setDocuments(result.data);
        } else {
            handleError(result, 'Error al obtener los documentos');
        }
        setLoading(false);

        return result;
    }, [handleError]);

    const uploadDocument = async (file) => {
        const result = await documentsService.uploadDocument(file);

        if (result.success) {
            if (result.data) {
                setDocuments(prev => [...prev, result.data]);
                selectDocument(result.data.id)
            } else {
                await fetchDocuments();
            }
            showSuccess('Documento subido exitosamente');
        } else {
            handleError(result, 'Error al subir el documento');
        }

        return result;
    };

    const updateDocument = async (id, data) => {
        const result = await documentsService.updateDocument(id, data);

        if (result.success) {
            if (result.data) {
                setDocuments(prev =>
                    prev.map(doc =>
                        doc.id === id ? { ...doc, ...result.data } : doc
                    )
                );
            } else {
                await fetchDocuments();
            }
        } else {
            handleError(result, 'Error al actualizar el documento');
        }

        return result;
    };

    const deleteDocument = async (id) => {
        const result = await documentsService.deleteDocument(id);

        if (result.success) {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
            if (selectedDocumentId === id) {
                setSelectedDocumentId(null)
            }
        } else {
            handleError(result, 'Error al eliminar el documento');
        }

        return result;
    };

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    return {
        documents,
        loading,
        fetchDocuments,
        uploadDocument,
        updateDocument,
        deleteDocument,
    };
};