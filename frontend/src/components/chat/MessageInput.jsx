import { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';
import LLMSelector from './LLMSelector';

const MessageInput = ({ onSendMessage, disabled = false, sendingMessage = false }) => {
    const [message, setMessage] = useState('');
    const [provider, setProvider] = useState('openai');
    const [model, setModel] = useState('gpt-4o');
    const [selectorExpanded, setSelectorExpanded] = useState(false);
    const textareaRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || disabled || sendingMessage || !provider || !model) return;

        const messageData = {
            content: message.trim(),
            provider,
            model
        };

        setMessage('');
        setSelectorExpanded(false);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        await onSendMessage(messageData);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleTextareaChange = (e) => {
        setMessage(e.target.value);

        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    };

    const canSend = message.trim() && provider && model && !disabled && !sendingMessage;

    return (
        <div className="bg-white border-t border-neutral-200 p-4 space-y-4">
            {/* Selector de LLM colapsable */}
            <LLMSelector
                provider={provider}
                model={model}
                onProviderChange={setProvider}
                onModelChange={setModel}
                disabled={disabled || sendingMessage}
                isExpanded={selectorExpanded}
                onExpandedChange={setSelectorExpanded}
            />

            {/* Input de mensaje */}
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyUp={handleKeyPress}
                        placeholder={disabled ? "Selecciona una conversación para comenzar..." : "Escribe tu mensaje aquí..."}
                        disabled={disabled || sendingMessage}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 disabled:cursor-not-allowed"
                        rows="1"
                        style={{ maxHeight: '120px', minHeight: '40px' }}
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="shrink-0 p-2"
                    disabled={!canSend}
                    loading={sendingMessage}
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
};

export default MessageInput;