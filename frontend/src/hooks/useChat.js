import { useState, useEffect } from 'react';
import { chatService } from '../services/chat';
import { useAppContext } from '../contexts/AppContext';
import { useErrorHandler } from './useErrorHandler';

export const useChat = () => {
    const { selectedDocumentId, activeConversationId, setActiveConversationId, selectConversation } = useAppContext();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const { handleError } = useErrorHandler();

    const fetchConversations = async () => {
        if (!selectedDocumentId) return;

        setLoading(true);

        const result = await chatService.getConversations(selectedDocumentId);
        if (result.success) {
            setConversations(result.data);
        } else {
            handleError(result, 'Error al obtener las conversaciones')
        }
        setLoading(false);
        return result
    };

    const createConversation = async (title) => {
        if (!selectedDocumentId || !title.trim()) return null;

        const result = await chatService.createConversation(title.trim(), selectedDocumentId);

        if (result.success) {
            await fetchConversations();
            setActiveConversationId(result.data.id);
            return result.data;
        } else {
            handleError(result, 'Error al crear la conversación')
            return null;
        }
    };

    const deleteConversation = async (conversationId) => {
        setLoading(true)
        const result = await chatService.deleteConversation(conversationId);

        if (result.success) {
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            if (activeConversationId === conversationId) {
                setActiveConversationId(null);
            }
        } else {
            handleError(result, 'Error al eliminar la conversación')
        }
        setLoading(false)

        return result;
    };

    const fetchMessages = async (conversationId) => {
        if (!conversationId) return;

        setLoading(true);
        const result = await chatService.getMessages(conversationId);

        if (result.success) {
            setMessages(result.data);
        } else {
            handleError(result, 'Error al obtener los mensajes')
        }

        setLoading(false)
        return result
    };

    const sendMessage = async (content) => {
        if (!activeConversationId || !content.trim()) return null;

        setSendingMessage(true);
        const result = await chatService.sendMessage(activeConversationId, content.trim());

        if (result.success) {
            await fetchMessages(activeConversationId);
        } else {
            handleError(result, 'Error al enviar el mensaje')
        }
        setSendingMessage(false);

        return result;
    };

    useEffect(() => {
        if (selectedDocumentId) {
            fetchConversations();
        } else {
            setConversations([]);
            setActiveConversationId(null);
            setMessages([]);
        }
    }, [selectedDocumentId]);

    useEffect(() => {
        if (activeConversationId) {
            const conversation = conversations.find(c => c.id === activeConversationId);
            if (conversation) {
                setActiveConversationId(conversation.id);
                fetchMessages(activeConversationId);
            }
        } else {
            setActiveConversationId(null);
            setMessages([]);
        }
    }, [activeConversationId, setActiveConversationId, conversations]);

    return {
        conversations,
        activeConversationId,
        messages,
        loading,
        sendingMessage,
        createConversation,
        deleteConversation,
        selectConversation,
        sendMessage,
    };
};