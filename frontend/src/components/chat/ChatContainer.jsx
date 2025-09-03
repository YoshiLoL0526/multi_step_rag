import { useChat } from '../../hooks/useChat';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';
import { MessageSquare } from 'lucide-react';

const ChatContainer = () => {
    const {
        activeConversationId,
        messages,
        loading,
        sendingMessage,
        sendMessage,
    } = useChat();

    const handleSendMessage = async (messageData) => {
        return await sendMessage(messageData);
    };

    if (!activeConversationId) {
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

    return (
        <div className="h-full flex">
            <div className="flex-1 flex flex-col">
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