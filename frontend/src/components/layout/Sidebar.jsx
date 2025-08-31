import { FileText, MessageSquare, Search } from 'lucide-react';
import Input from '../ui/Input';
import DocumentsTab from '../documents/DocumentsTab';
import ConversationsTab from '../chat/ConversationsTab';
import { useResponsive } from '../../hooks/useResponsive';

const Sidebar = ({ isOpen, onClose, activeTab, onTabChange }) => {
    const { isMobile } = useResponsive();

    const tabs = [
        {
            id: 'documents',
            name: 'Documentos',
            icon: FileText,
        },
        {
            id: 'conversations',
            name: 'Conversaciones',
            icon: MessageSquare,
        },
    ];

    const sidebarClasses = `
        ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'relative'}
        bg-white border-r border-neutral-200
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
        ${isMobile ? 'w-80' : 'w-80'}
        flex flex-col
    `.trim();

    return (
        <>
            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={sidebarClasses}>
                {/* Header */}
                <div className="p-4 border-b border-neutral-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-neutral-900">
                            Contenido
                        </h2>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <Input
                            placeholder="Buscar..."
                            className="pl-10 text-sm"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-neutral-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors
                                    ${activeTab === tab.id
                                        ? 'border-primary-500 text-primary-600 bg-primary-50'
                                        : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
                                    }
                                `}
                            >
                                <Icon className="h-4 w-4" />
                                <span className="hidden sm:block">{tab.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'documents' && <DocumentsTab />}
                    {activeTab === 'conversations' && <ConversationsTab />}
                </div>
            </div>
        </>
    );
};

export default Sidebar;