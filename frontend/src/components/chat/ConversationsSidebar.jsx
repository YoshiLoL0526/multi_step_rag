import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import ConversationsList from './ConversationsList';

const ConversationsSidebar = () => {
    const {
        conversations,
        activeConversationId,
        error,
        createConversation,
        selectConversation,
        deleteConversation,
        clearError,
        loading
    } = useChat();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');

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

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-neutral-900">Conversaciones</h3>
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                        {conversations.length}
                    </span>
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

            {/* Error display */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-error-600">{error}</p>
                        <button
                            onClick={clearError}
                            className="text-error-500 hover:text-error-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Conversations list */}
            <ConversationsList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={selectConversation}
                onDeleteConversation={deleteConversation}
                loading={loading}
            />

            {/* Create conversation modal */}
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
                        placeholder="Ej: Preguntas sobre el capítulo 3"
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

export default ConversationsSidebar;