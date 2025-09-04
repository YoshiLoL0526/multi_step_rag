import { useState, useEffect, useCallback } from 'react';
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

    const fetchConversations = useCallback(async () => {
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
    }, [handleError, selectedDocumentId]);

    const createConversation = async (title) => {
        if (!selectedDocumentId || !title.trim()) return null;

        const result = await chatService.createConversation(title.trim(), selectedDocumentId);

        if (result.success) {
            await fetchConversations();
            setActiveConversationId(result.data.id);
            setMessages([])
            return result.data;
        } else {
            handleError(result, 'Error al crear la conversación')
            return null;
        }
    };

    const deleteConversation = async (conversationId) => {
        const result = await chatService.deleteConversation(conversationId);

        if (result.success) {
            setConversations(prev => prev.filter(conv => conv.id !== conversationId));
            if (activeConversationId === conversationId) {
                setActiveConversationId(null);
                setMessages([]);
            }
        } else {
            handleError(result, 'Error al eliminar la conversación')
        }

        return result;
    };

    const fetchMessages = useCallback(async (conversationId) => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        setLoading(true);
        const result = await chatService.getMessages(conversationId);

        if (result.success) {
            setMessages(result.data);
        } else {
            handleError(result, 'Error al obtener los mensajes')
        }

        setLoading(false)
        return result
    }, [handleError]);

    const sendMessage = async (messageData) => {
        if (!activeConversationId || !messageData.content.trim()) return null;

        const tempId = `temp_${Date.now()}`;
        const userMessage = {
            id: tempId,
            role: 'user',
            content: messageData.content,
            created_at: new Date().toISOString()
        };

        setMessages(prevMessages => [...prevMessages, userMessage]);

        setSendingMessage(true);
        const result = await chatService.sendMessage(activeConversationId, messageData);

        if (result.success) {
            await fetchMessages(activeConversationId);
        } else {
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempId));
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
    }, [selectedDocumentId, fetchConversations, setActiveConversationId]);

    useEffect(() => {
        fetchMessages(activeConversationId);
    }, [activeConversationId, fetchMessages]);

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
        setMessages,
    };
};