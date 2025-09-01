import { useState, useEffect } from 'react';
import { chatService } from '../services/chat';
import { useAppContext } from '../contexts/AppContext';

export const useChat = () => {
    const { selectedDocumentId, activeConversationId, setActiveConversationId, selectConversation } = useAppContext();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [error, setError] = useState(null);

    // Cargar conversaciones cuando cambia el documento seleccionado
    useEffect(() => {
        if (selectedDocumentId) {
            fetchConversations();
        } else {
            setConversations([]);
            setActiveConversationId(null);
            setMessages([]);
        }
    }, [selectedDocumentId]);

    // Cargar conversación activa cuando cambia el ID
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
    }, [activeConversationId, conversations]);

    const fetchConversations = async () => {
        if (!selectedDocumentId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await chatService.getConversations(selectedDocumentId);
            if (result.success) {
                setConversations(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al cargar conversaciones');
        } finally {
            setLoading(false);
        }
    };

    const createConversation = async (title) => {
        if (!selectedDocumentId || !title.trim()) return null;

        setError(null);

        try {
            const result = await chatService.createConversation(title.trim(), selectedDocumentId);

            if (result.success) {
                await fetchConversations();
                setActiveConversationId(result.data.id);
                return result.data;
            } else {
                setError(result.error);
                return null;
            }
        } catch (err) {
            setError('Error al crear conversación');
            return null;
        }
    };

    const deleteConversation = async (conversationId) => {
        setError(null);

        try {
            const result = await chatService.deleteConversation(conversationId);

            if (result.success) {
                setConversations(prev => prev.filter(conv => conv.id !== conversationId));
                if (activeConversationId === conversationId) {
                    setActiveConversationId(null);
                }
            } else {
                setError(result.error);
            }

            return result;
        } catch (err) {
            setError('Error al eliminar conversación');
            return { success: false, error: 'Error al eliminar conversación' };
        }
    };

    const fetchMessages = async (conversationId) => {
        if (!conversationId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await chatService.getMessages(conversationId);

            if (result.success) {
                setMessages(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al cargar mensajes');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content) => {
        if (!activeConversationId || !content.trim()) return null;

        setSendingMessage(true);
        setError(null);

        try {
            const result = await chatService.sendMessage(activeConversationId, content.trim());

            if (result.success) {
                await fetchMessages(activeConversationId);
            } else {
                setError(result.error);
            }

            return result;
        } catch (err) {
            setError('Error al enviar mensaje');
            return { success: false, error: 'Error al enviar mensaje' };
        } finally {
            setSendingMessage(false);
        }
    };

    return {
        conversations,
        activeConversationId,
        messages,
        loading,
        sendingMessage,
        error,
        createConversation,
        deleteConversation,
        selectConversation,
        sendMessage,
        clearError: () => setError(null),
    };
};