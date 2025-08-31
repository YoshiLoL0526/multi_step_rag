import { useState } from 'react';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header = ({ onToggleSidebar, isSidebarOpen, isMobile }) => {
    const { user, logout } = useAuth();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsUserMenuOpen(false);
    };

    return (
        <header className="bg-white border-b border-neutral-200 shadow-soft sticky top-0 z-40">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        {isMobile && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggleSidebar}
                                className="p-2"
                            >
                                {isSidebarOpen ? (
                                    <X className="h-5 w-5" />
                                ) : (
                                    <Menu className="h-5 w-5" />
                                )}
                            </Button>
                        )}

                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-neutral-900">
                                MultiStep RAG
                            </h1>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* User menu */}
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 p-2"
                            >
                                <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-primary-600" />
                                </div>
                                {!isMobile && (
                                    <span className="text-sm text-neutral-700 max-w-32 truncate">
                                        {user?.email}
                                    </span>
                                )}
                            </Button>

                            {/* Dropdown menu */}
                            {isUserMenuOpen && (
                                <>
                                    {/* Overlay */}
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    />

                                    {/* Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-neutral-200 py-1 z-20">
                                        <div className="px-4 py-2 border-b border-neutral-100">
                                            <p className="text-sm font-medium text-neutral-900 truncate">
                                                {user?.email}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                ID: {user?.id}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                // TODO: Implement settings
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                                        >
                                            <Settings className="h-4 w-4 mr-3" />
                                            Configuración
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;