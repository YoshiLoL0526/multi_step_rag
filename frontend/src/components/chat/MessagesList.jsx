import { useEffect, useRef, memo } from 'react';
import { User, Bot, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

const MessagesList = ({ messages, loading, sendingMessage }) => {
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 100);

        return () => clearTimeout(timer);
    }, [messages, sendingMessage]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-6"
            style={{ scrollBehavior: 'smooth' }}
        >
            {messages.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    {messages.map((message, index) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isLastMessage={index === messages.length - 1}
                        />
                    ))}

                    {sendingMessage && <TypingIndicator />}
                </>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

const EmptyState = memo(() => (
    <div className="flex items-center justify-center h-full text-center">
        <div className="max-w-sm">
            <div className="h-20 w-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
                <Bot className="h-10 w-10 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                Inicia la conversación
            </h3>
            <p className="text-neutral-600 mb-4">
                Haz tu primera pregunta sobre el documento y comenzaremos a chatear.
            </p>
            <div className="text-xs text-neutral-500 space-y-1">
                <p>💡 Puedes preguntar sobre contenido específico</p>
                <p>📝 Solicitar resúmenes o explicaciones</p>
                <p>🔍 Buscar información detallada</p>
            </div>
        </div>
    </div>
));

const TypingIndicator = memo(() => (
    <div className="flex items-start space-x-3 animate-fade-in">
        <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-600" />
            </div>
        </div>
        <div className="flex-1">
            <div className="bg-neutral-100 rounded-2xl px-4 py-3 max-w-xs shadow-soft">
                <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                                style={{
                                    animationDelay: `${i * 0.15}s`,
                                    animationDuration: '0.8s'
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-neutral-500 ml-2">
                        Escribiendo...
                    </span>
                </div>
            </div>
        </div>
    </div>
));

const MessageBubble = memo(({ message, isLastMessage }) => {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === 'user';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error copying to clipboard:', err);
        }
    };

    return (
        <div className={`group flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''
            } ${isLastMessage ? 'mb-4' : ''}`}>
            {/* Avatar mejorado */}
            <div className="flex-shrink-0">
                <div className={`
                    h-8 w-8 rounded-full flex items-center justify-center shadow-soft transition-transform group-hover:scale-105
                    ${isUser
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700'
                        : 'bg-gradient-to-br from-primary-100 to-primary-200'
                    }
                `}>
                    {isUser ? (
                        <User className="h-4 w-4 text-white" />
                    ) : (
                        <Bot className="h-4 w-4 text-primary-600" />
                    )}
                </div>
            </div>

            {/* Contenido del mensaje */}
            <div className={`flex-1 ${isUser ? 'flex flex-col items-end' : ''}`}>
                <div className="relative">
                    <div className={`
                            inline-block rounded-2xl px-4 py-3 shadow-soft transition-all duration-200 group-hover:shadow-medium
                            ${isUser
                            ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                            : 'bg-white text-neutral-900 border border-neutral-200'
                        }
                        `}>
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                            {message.content}
                        </p>
                    </div>

                    {/* Botón de copiar para mensajes del asistente */}
                    {!isUser && (
                        <button
                            onClick={handleCopy}
                            className={`
                                absolute top-2 right-2 p-1.5 rounded-lg transition-all duration-200
                                opacity-0 group-hover:opacity-100 hover:bg-neutral-100
                                ${copied ? 'bg-success-100 text-success-600' : 'text-neutral-400 hover:text-neutral-600'}
                            `}
                            title={copied ? 'Copiado!' : 'Copiar mensaje'}
                        >
                            {copied ? (
                                <Check className="h-3 w-3" />
                            ) : (
                                <Copy className="h-3 w-3" />
                            )}
                        </button>
                    )}
                </div>

                {/* Timestamp */}
                <div className={`text-xs text-neutral-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {new Date(message.created_at).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
});

export default MessagesList;