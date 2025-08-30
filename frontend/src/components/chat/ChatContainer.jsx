import { MessageSquare, Upload, Send } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

const ChatContainer = () => {
    return (
        <div className="h-full flex flex-col">
            {/* Chat header */}
            <div className="bg-white border-b border-neutral-200 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-900">
                            Nueva Conversación
                        </h3>
                        <p className="text-sm text-neutral-500">
                            Selecciona un documento para comenzar
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="max-w-md">
                        <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                            ¡Bienvenido a MultiStep RAG!
                        </h3>
                        <p className="text-neutral-600 mb-6">
                            Para comenzar, sube un documento desde la barra lateral y luego inicia una conversación.
                        </p>
                        <div className="space-y-2 text-sm text-neutral-500">
                            <p>✓ Sube documentos PDF, TXT o DOCX</p>
                            <p>✓ Haz preguntas sobre el contenido</p>
                            <p>✓ Obtén respuestas inteligentes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input area */}
            <div className="bg-white border-t border-neutral-200 p-4">
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        size="md"
                        className="shrink-0"
                        disabled
                    >
                        <Upload className="h-4 w-4" />
                    </Button>

                    <div className="flex-1">
                        <Input
                            placeholder="Escribe tu mensaje aquí..."
                            disabled
                        />
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        className="shrink-0"
                        disabled
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChatContainer;