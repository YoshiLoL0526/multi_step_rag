import { useState } from 'react';
import { FileText, MoreVertical, Download, Edit2, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import LoadingSpinner from '../ui/LoadingSpinner';

const DocumentList = ({ documents, loading, onDelete, onUpdate }) => {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const getStatusBadge = (status) => {
        const statusConfig = {
            processing: { variant: 'warning', icon: Clock, text: 'Procesando' },
            completed: { variant: 'success', icon: CheckCircle, text: 'Completado' },
            failed: { variant: 'error', icon: XCircle, text: 'Error' },
            pending: { variant: 'default', icon: Clock, text: 'Pendiente' },
        };

        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant}>
                <Icon className="h-3 w-3 mr-1" />
                {config.text}
            </Badge>
        );
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = async () => {
        if (!selectedDocument) return;

        setActionLoading('delete');
        await onDelete(selectedDocument.id);
        setActionLoading(null);
        setShowDeleteModal(false);
        setSelectedDocument(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
                <p className="text-sm text-neutral-500">No hay documentos subidos</p>
                <p className="text-xs text-neutral-400 mt-1">
                    Sube tu primer documento para comenzar
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {documents.map((document) => (
                    <div
                        key={document.id}
                        className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-5 w-5 text-primary-600" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <h4 className="text-sm font-medium text-neutral-900 truncate">
                                            {document.title || document.filename}
                                        </h4>
                                        {getStatusBadge(document.status)}
                                    </div>

                                    <p className="text-xs text-neutral-500 mb-2 truncate">
                                        {document.filename}
                                    </p>

                                    <div className="flex items-center space-x-4 text-xs text-neutral-400">
                                        <span>{formatFileSize(document.file_size)}</span>
                                        <span>{formatDate(document.created_at)}</span>
                                        {document.pages_count && (
                                            <span>{document.pages_count} páginas</span>
                                        )}
                                    </div>

                                    {document.description && (
                                        <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                                            {document.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Actions menu */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedDocument(
                                        selectedDocument?.id === document.id ? null : document
                                    )}
                                    className="p-1"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>

                                {selectedDocument?.id === document.id && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setSelectedDocument(null)}
                                        />
                                        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-medium border border-neutral-200 py-1 z-20">
                                            <button
                                                onClick={() => {
                                                    // TODO: Implement download
                                                    setSelectedDocument(null);
                                                }}
                                                className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Descargar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // TODO: Implement edit
                                                    setSelectedDocument(null);
                                                }}
                                                className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                                            >
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => setShowDeleteModal(true)}
                                                className="flex items-center w-full px-3 py-2 text-sm text-error-600 hover:bg-error-50"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete confirmation modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => !actionLoading && setShowDeleteModal(false)}
                title="Eliminar documento"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-sm text-neutral-600">
                        ¿Estás seguro de que quieres eliminar "{selectedDocument?.title || selectedDocument?.filename}"?
                        Esta acción no se puede deshacer.
                    </p>

                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={actionLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="danger"
                            onClick={handleDelete}
                            loading={actionLoading === 'delete'}
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default DocumentList;