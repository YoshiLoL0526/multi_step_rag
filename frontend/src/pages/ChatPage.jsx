import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const ChatPage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-neutral-50">
            <header className="bg-white shadow-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-xl font-semibold text-neutral-900">
                            MultiStep RAG
                        </h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-neutral-600">
                                Bienvenido, {user?.email}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                            >
                                Cerrar sesión
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                        Chat Interface
                    </h2>
                    <p className="text-neutral-600">
                        La interfaz de chat estará disponible en la siguiente fase.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ChatPage;