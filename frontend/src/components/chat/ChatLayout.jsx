import { useState } from 'react';
import { MessageSquare, FileText, ChevronRight, X } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useDocuments } from '../../hooks/useDocuments';
import { useResponsive } from '../../hooks/useResponsive';
import ChatContainer from './ChatContainer';
import ConversationsSidebar from './ConversationsSidebar';
import Button from '../ui/Button';

const ChatLayout = () => {
    const { selectedDocumentId } = useAppContext();
    const { documents } = useDocuments();
    const { isMobile } = useResponsive();
    const [showConversations, setShowConversations] = useState(!isMobile);

    const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

    if (!selectedDocumentId) {
        return (
            <div className="h-full flex items-center justify-center bg-neutral-50">
                <div className="text-center max-w-md px-4">
                    <FileText className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                        Selecciona un documento
                    </h3>
                    <p className="text-neutral-600 mb-6">
                        Elige un documento para comenzar a chatear con él.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex overflow-hidden relative">
            {/* Área principal del chat */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header con información del documento - altura fija */}
                <div className="flex-shrink-0 bg-white border-b border-neutral-200 px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 text-primary-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-neutral-900 truncate">
                                    {selectedDocument?.title || selectedDocument?.filename}
                                </h3>
                                <p className="text-xs text-neutral-500 truncate">
                                    {selectedDocument?.filename}
                                </p>
                            </div>
                        </div>

                        {/* Botón para mostrar/ocultar conversaciones */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowConversations(!showConversations)}
                            className="flex items-center space-x-2 flex-shrink-0 ml-2"
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span className="hidden sm:inline">Conversaciones</span>
                            <ChevronRight
                                className={`h-4 w-4 transition-transform ${showConversations ? 'rotate-180' : ''
                                    }`}
                            />
                        </Button>
                    </div>
                </div>

                {/* Contenido del chat - área scrolleable */}
                <div className="flex-1 min-h-0">
                    <ChatContainer />
                </div>
            </div>

            {/* Sidebar de conversaciones */}
            {showConversations && (
                <div className={`
                    bg-white border-l border-neutral-200 flex flex-col
                    ${isMobile
                        ? 'absolute inset-y-0 right-0 w-80 shadow-lg z-20'
                        : 'w-80 relative'
                    }
                `}>
                    {isMobile && (
                        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-neutral-200">
                            <h3 className="font-medium text-neutral-900">Conversaciones</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowConversations(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <div className="flex-1 min-h-0">
                        <ConversationsSidebar />
                    </div>
                </div>
            )}

            {/* Overlay para móvil */}
            {isMobile && showConversations && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-50 z-10"
                    onClick={() => setShowConversations(false)}
                />
            )}
        </div>
    );
};

export default ChatLayout;