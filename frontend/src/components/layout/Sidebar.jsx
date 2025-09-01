import { Search } from 'lucide-react';
import Input from '../ui/Input';
import DocumentsSidebar from '../documents/DocumentsSidebar';
import { useResponsive } from '../../hooks/useResponsive';

const Sidebar = ({ isOpen, onClose }) => {
    const { isMobile } = useResponsive();

    const sidebarClasses = `
        ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'relative'}
        bg-white border-r border-neutral-200
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
        w-80 flex flex-col h-full
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
                {/* Header - altura fija */}
                <div className="flex-shrink-0 p-4 border-b border-neutral-200">
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

                {/* Content - área scrolleable */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <DocumentsSidebar />
                </div>
            </div>
        </>
    );
};

export default Sidebar;