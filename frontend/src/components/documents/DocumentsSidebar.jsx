import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import DocumentUpload from './DocumentUpload';
import DocumentList from './DocumentList';
import { useDocuments } from '../../hooks/useDocuments';
import { useModalActions } from '../../hooks/useModalActions';

const DocumentsSidebar = () => {
    const {
        documents,
        loading,
        uploadDocument,
        deleteDocument,
        updateDocument,
    } = useDocuments();

    const { showUploadModal, closeModal } = useModalActions();
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file) => {
        setUploading(true);
        const result = await uploadDocument(file);
        setUploading(false);

        return result;
    };

    const handleShowUploadModal = () => {
        const modalId = showUploadModal({
            content: (
                <DocumentUpload
                    onUpload={handleUpload}
                    onClose={() => closeModal(modalId)}
                    loading={uploading}
                />
            )
        });
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
                    onClick={handleShowUploadModal}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Subir documento
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <DocumentList
                    documents={documents}
                    loading={loading}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </div>
        </div>
    );
};

export default DocumentsSidebar;