import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';
import { useDocuments } from '../../hooks/useDocuments';

const DocumentsTab = () => {
    const {
        documents,
        loading,
        error,
        uploadDocument,
        deleteDocument,
        updateDocument,
        clearError,
    } = useDocuments();

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file, onProgress) => {
        setUploading(true);
        const result = await uploadDocument(file, onProgress);
        setUploading(false);

        if (result.success) {
            setShowUploadModal(false);
        }

        return result;
    };

    const handleDelete = async (documentId) => {
        return await deleteDocument(documentId);
    };

    const handleUpdate = async (documentId, data) => {
        return await updateDocument(documentId, data);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200">
                <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowUploadModal(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Subir documento
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {error && (
                    <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                        <p className="text-sm text-error-600">{error}</p>
                        <button
                            onClick={clearError}
                            className="text-xs text-error-500 hover:text-error-700 mt-1"
                        >
                            Cerrar
                        </button>
                    </div>
                )}

                <DocumentList
                    documents={documents}
                    loading={loading}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </div>

            {/* Upload Modal */}
            <Modal
                isOpen={showUploadModal}
                onClose={() => !uploading && setShowUploadModal(false)}
                title="Subir nuevo documento"
                size="lg"
            >
                <DocumentUpload
                    onUpload={handleUpload}
                    loading={uploading}
                />
            </Modal>
        </div>
    );
};

export default DocumentsTab;