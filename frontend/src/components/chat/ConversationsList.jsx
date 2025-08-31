import { useState } from 'react';
import { MessageSquare, Trash2, MoreVertical } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const ConversationsList = ({
    conversations,
    activeConversation,
    onSelectConversation,
    onDeleteConversation,
    loading
}) => {
    const [menuOpen, setMenuOpen] = useState(null);

    const handleDelete = async (conversationId, e) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que quieres eliminar esta conversación?')) {
            await onDeleteConversation(conversationId);
        }
        setMenuOpen(null);
    };

    const formatTitle = (title) => {
        return title.length > 30 ? title.substring(0, 30) + '...' : title;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Lista de conversaciones */}
            <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-neutral-500">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 text-neutral-300" />
                        <p className="text-sm">No hay conversaciones</p>
                        <p className="text-xs text-neutral-400 mt-1">
                            Crea tu primera conversación
                        </p>
                    </div>
                ) : (
                    <div className="p-2 space-y-1">
                        {conversations.map((conversation) => (
                            <div
                                key={conversation.id}
                                className={`
                                    group relative flex items-center p-3 rounded-lg cursor-pointer transition-colors
                                    ${activeConversation?.id === conversation.id
                                        ? 'bg-primary-100 border border-primary-200'
                                        : 'hover:bg-neutral-50 border border-transparent'
                                    }
                                `}
                                onClick={() => onSelectConversation(conversation)}
                            >
                                <div className="flex-shrink-0 mr-3">
                                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                        <MessageSquare className="h-4 w-4 text-primary-600" />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 truncate">
                                        {formatTitle(conversation.title)}
                                    </p>
                                    <p className="text-xs text-neutral-500">
                                        ID: {conversation.id}
                                    </p>
                                </div>

                                {/* Menu de acciones */}
                                <div className="flex-shrink-0 ml-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpen(menuOpen === conversation.id ? null : conversation.id);
                                        }}
                                        className="p-1 rounded hover:bg-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreVertical className="h-4 w-4 text-neutral-500" />
                                    </button>

                                    {menuOpen === conversation.id && (
                                        <>
                                            {/* Overlay */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setMenuOpen(null);
                                                }}
                                            />

                                            {/* Menu */}
                                            <div className="absolute right-0 top-8 z-20 bg-white border border-neutral-200 rounded-lg shadow-medium py-1 min-w-[120px]">
                                                <button
                                                    onClick={(e) => handleDelete(conversation.id, e)}
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConversationsList;