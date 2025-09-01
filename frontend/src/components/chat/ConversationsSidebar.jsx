import { Plus } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import Button from '../ui/Button';
import ConversationsList from './ConversationsList';
import { useModalActions } from '../../hooks/useModalActions';
import ConversationForm from './ConversationForm'

const ConversationsSidebar = () => {
    const {
        conversations,
        activeConversationId,
        createConversation,
        selectConversation,
        deleteConversation,
        loading
    } = useChat();

    const { showConfirmDialog, closeModal } = useModalActions();

    const handleShowCreateModal = () => {
        const modalId = showConfirmDialog({
            content: (
                <ConversationForm
                    createConversation={createConversation}
                    onClose={() => closeModal(modalId)}
                />
            )
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
                    onClick={handleShowCreateModal}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva conversación
                </Button>
            </div>

            {/* Conversations list */}
            <ConversationsList
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={selectConversation}
                onDeleteConversation={deleteConversation}
                loading={loading}
            />
        </div>
    );
};

export default ConversationsSidebar;