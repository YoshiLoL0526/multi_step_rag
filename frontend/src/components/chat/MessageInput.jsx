import { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';

const MessageInput = ({ onSendMessage, disabled = false, sendingMessage = false }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || disabled || sendingMessage) return;

        const messageToSend = message.trim();
        setMessage('');

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        await onSendMessage(messageToSend);
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

    return (
        <div className="bg-white border-t border-neutral-200 p-4">
            <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                {/* Message input */}
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

                {/* Send button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="shrink-0 p-2"
                    disabled={disabled || sendingMessage || !message.trim()}
                    loading={sendingMessage}
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
};

export default MessageInput;