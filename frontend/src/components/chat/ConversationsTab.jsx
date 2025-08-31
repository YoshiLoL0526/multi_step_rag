import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useDocuments } from '../../hooks/useDocuments';
import { useChat } from '../../hooks/useChat';
import Button from '../ui/Button';
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import LoadingSpinner from '../ui/LoadingSpinner';
import ConversationsList from './ConversationsList';

const ConversationsTab = () => {
    const { selectedDocumentId } = useAppContext();
    const { documents } = useDocuments();
    const {
        conversations,
        activeConversation,
        loading,
        error,
        createConversation,
        selectConversation,
        deleteConversation,
        clearError,
    } = useChat();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

    const handleCreate = async () => {
        if (!newTitle.trim()) return;

        setCreating(true);
        const result = await createConversation(newTitle.trim());
        setCreating(false);

        if (result) {
            setShowCreateModal(false);
            setNewTitle('');
        }
    };

    if (!selectedDocumentId) {
        return (
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-neutral-200">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                        Sin documento seleccionado
                    </h3>
                    <p className="text-sm text-neutral-500">
                        Selecciona un documento en la pestaña "Documentos" para ver sus conversaciones
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* Document header */}
            <div className="p-4 border-b border-neutral-200 bg-primary-50">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-neutral-900 truncate">
                            {selectedDocument?.filename}
                        </h3>
                        <p className="text-xs text-neutral-500">
                            ID: {selectedDocumentId}
                        </p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva conversación
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {error && (
                    <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-error-600">{error}</p>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearError}
                                className="text-error-700 hover:text-error-800"
                            >
                                Cerrar
                            </Button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <ConversationsList
                        conversations={conversations}
                        activeConversation={activeConversation}
                        onSelectConversation={selectConversation}
                        onDeleteConversation={deleteConversation}
                        loading={loading}
                    />
                )}
            </div>

            {/* Modal para crear conversación */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nueva Conversación"
                size="md"
            >
                <div className="space-y-4">
                    <Input
                        label="Título de la conversación"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ej: Preguntas sobre el documento"
                        required
                    />

                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="ghost"
                            onClick={() => setShowCreateModal(false)}
                            disabled={creating}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreate}
                            loading={creating}
                            disabled={!newTitle.trim()}
                        >
                            Crear Conversación
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ConversationsTab;