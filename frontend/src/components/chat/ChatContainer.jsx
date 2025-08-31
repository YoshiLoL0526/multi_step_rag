import { useChat } from '../../hooks/useChat';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import Button from '../ui/Button';
import { MessageSquare } from 'lucide-react';

const ChatContainer = () => {
    const {
        activeConversation,
        messages,
        loading,
        sendingMessage,
        error,
        sendMessage,
        clearError
    } = useChat();

    const handleSendMessage = async (content) => {
        return await sendMessage(content);
    };

    // Vista cuando no hay conversación activa
    if (!activeConversation) {
        return (
            <div className="h-full flex">
                <div className="flex-1 flex items-center justify-center bg-neutral-50">
                    <div className="text-center max-w-md">
                        <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                            Selecciona una conversación
                        </h3>
                        <p className="text-neutral-600">
                            Elige una conversación del panel lateral para comenzar a chatear.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Vista principal del chat cuando hay conversación activa
    return (
        <div className="h-full flex">
            <div className="flex-1 flex flex-col">
                {/* Error display */}
                {error && (
                    <div className="bg-error-50 border-b border-error-200 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-error-700">{error}</p>
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

                {/* Messages area */}
                <MessagesList
                    messages={messages}
                    loading={loading}
                    sendingMessage={sendingMessage}
                />

                {/* Input area */}
                <MessageInput
                    onSendMessage={handleSendMessage}
                    disabled={false}
                    sendingMessage={sendingMessage}
                />
            </div>
        </div>
    );
};

export default ChatContainer;