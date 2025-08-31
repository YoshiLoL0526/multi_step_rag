import { useState } from 'react';
import { Plus, MessageSquare, Trash2, MoreVertical } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';

const ConversationsSidebar = () => {
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
    const [menuOpen, setMenuOpen] = useState(null);

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

    const handleDelete = async (conversationId, e) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
            await deleteConversation(conversationId);
        }
        setMenuOpen(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
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
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner />
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageSquare className="h-8 w-8 mx-auto mb-3 text-neutral-300" />
                        <p className="text-sm text-neutral-500 mb-1">No hay conversaciones</p>
                        <p className="text-xs text-neutral-400">
                            Crea tu primera conversación con este documento
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`
                                    group relative p-3 rounded-lg cursor-pointer transition-all
                                    ${activeConversation?.id === conversation.id
                                        ? 'bg-primary-100 border border-primary-200 shadow-sm'
                                        : 'hover:bg-neutral-50 border border-transparent'
                                    }
                                `}
                                onClick={() => selectConversation(conversation)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-neutral-900 truncate mb-1">
                                            {conversation.title}
                                        </h4>
                                        <p className="text-xs text-neutral-500">
                                            {formatDate(conversation.created_at)}
                                        </p>
                                        {conversation.last_message && (
                                            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                                                {conversation.last_message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="ml-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMenuOpen(menuOpen === conversation.id ? null : conversation.id);
                                            }}
                                            className="p-1 rounded hover:bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreVertical className="h-4 w-4 text-neutral-400" />
                                        </button>

                                        {menuOpen === conversation.id && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMenuOpen(null);
                                                    }}
                                                />
                                                <div className="absolute right-0 top-8 z-20 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 min-w-[120px]">
                                                    <button
                                                        onClick={(e) => handleDelete(conversation.id, e)}
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
                )}
            </div>

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