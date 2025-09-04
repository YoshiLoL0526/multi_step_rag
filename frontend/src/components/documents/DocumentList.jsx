import { useState, useCallback, useMemo } from 'react';
import { FileText, MoreVertical, Download, Edit2, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useModalActions } from '../../hooks/useModalActions';
import DocumentDelete from './DocumentDelete';

const DocumentList = ({ documents, loading, onDelete, onUpdate }) => {
    const { selectedDocumentId, setSelectedDocumentId } = useAppContext();
    const { showConfirmDialog, closeModal } = useModalActions();
    const [activeMenuId, setActiveMenuId] = useState(null);

    const statusConfig = useMemo(() => ({
        processing: { variant: 'warning', icon: Clock, text: 'Procesando' },
        completed: { variant: 'success', icon: CheckCircle, text: 'Completado' },
        failed: { variant: 'error', icon: XCircle, text: 'Error' },
        pending: { variant: 'default', icon: Clock, text: 'Pendiente' },
    }), []);

    const getStatusBadge = useCallback((status) => {
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant}>
                <Icon className="h-3 w-3 mr-1" />
                {config.text}
            </Badge>
        );
    }, [statusConfig]);

    const formatFileSize = useCallback((bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    const handleDocumentSelect = useCallback((document) => {
        setSelectedDocumentId(document.id);
        setActiveMenuId(null);
    }, [setSelectedDocumentId]);

    const handleConfirmDelete = useCallback(async (document, modalId) => {
        if (!document) return;

        await onDelete(document.id);

        if (selectedDocumentId === document.id) {
            setSelectedDocumentId(null);
        }

        closeModal(modalId);
    }, [onDelete, selectedDocumentId, setSelectedDocumentId, closeModal]);

    const handleDeleteClick = useCallback((document) => {
        setActiveMenuId(null);

        const modalId = showConfirmDialog({
            title: 'Confirmar eliminación',
            content: (
                <DocumentDelete
                    onClose={() => closeModal(modalId)}
                    onDelete={() => handleConfirmDelete(document, modalId)}
                />
            )
        });
    }, [showConfirmDialog, closeModal, handleConfirmDelete]);

    const DocumentCard = useCallback(({ document }) => {
        const isSelected = selectedDocumentId === document.id;
        const hasMenu = activeMenuId === document.id;

        return (
            <div
                className={`
                   group relative bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer
                   ${isSelected
                        ? 'border-primary-500 bg-primary-50 shadow-sm ring-2 ring-primary-200'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }
               `}
                onClick={() => handleDocumentSelect(document)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                        {/* Icono mejorado con animación */}
                        <div className={`
                           h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200
                           ${isSelected ? 'bg-primary-600 shadow-lg' : 'bg-primary-100 group-hover:bg-primary-200'}
                       `}>
                            <FileText className={`h-5 w-5 transition-colors duration-200 ${isSelected ? 'text-white' : 'text-primary-600'
                                }`} />
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
                                <span className="flex items-center">
                                    {formatFileSize(document.file_size)}
                                </span>
                                <span>{formatDate(document.created_at)}</span>
                            </div>

                            {document.description && (
                                <p className="text-xs text-neutral-600 mt-2 line-clamp-2">
                                    {document.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Menú de acciones mejorado */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(hasMenu ? null : document.id);
                            }}
                            className={`p-2 transition-all duration-200 ${hasMenu
                                ? 'bg-neutral-100'
                                : 'opacity-0 group-hover:opacity-100 hover:bg-neutral-100'
                                }`}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>

                        {hasMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setActiveMenuId(null)}
                                />
                                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20 animate-fade-in">
                                    <button
                                        onClick={() => {
                                            // TODO: Implement download
                                            setActiveMenuId(null);
                                        }}
                                        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Descargar
                                    </button>
                                    <button
                                        onClick={() => {
                                            // TODO: Implement edit
                                            setActiveMenuId(null);
                                        }}
                                        className="flex items-center w-full px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(document)}
                                        className="flex items-center w-full px-3 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
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
        );
    }, [selectedDocumentId, activeMenuId, handleDocumentSelect, getStatusBadge, formatFileSize, formatDate, handleDeleteClick]);

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (documents.length === 0) {
        return (
            <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No hay documentos</h3>
                <p className="text-sm text-neutral-500 mb-1">
                    Sube tu primer documento para comenzar
                </p>
                <p className="text-xs text-neutral-400">
                    Arrastra archivos o usa el botón "Subir documento"
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {documents.map((document) => (
                <DocumentCard key={document.id} document={document} />
            ))}
        </div>
    );
};

export default DocumentList;