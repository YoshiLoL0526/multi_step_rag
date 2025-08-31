import { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const MessagesList = ({ messages, loading, sendingMessage }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, sendingMessage]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                    <div>
                        <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bot className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="text-lg font-medium text-neutral-900 mb-2">
                            Inicia la conversación
                        </h3>
                        <p className="text-neutral-600">
                            Escribe tu primera pregunta sobre el documento
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                        />
                    ))}

                    {/* Mensaje de "escribiendo" cuando se está enviando */}
                    {sendingMessage && (
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-primary-600" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="bg-neutral-100 rounded-lg p-3 max-w-md">
                                    <div className="flex items-center space-x-1">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span className="text-xs text-neutral-500 ml-2">El asistente está escribiendo...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isUser ? 'bg-primary-600' : 'bg-primary-100'
                    }`}>
                    {isUser ? (
                        <User className="h-4 w-4 text-white" />
                    ) : (
                        <Bot className="h-4 w-4 text-primary-600" />
                    )}
                </div>
            </div>

            {/* Message content */}
            <div className="flex-1">
                <div className={`rounded-lg p-3 max-w-md ${isUser
                    ? 'bg-primary-600 text-white ml-auto'
                    : 'bg-neutral-100 text-neutral-900'
                    }`}>
                    <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MessagesList;