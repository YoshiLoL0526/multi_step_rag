import { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

const GlobalModal = ({
    id,
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEscape = true
}) => {
    useEffect(() => {
        if (!isOpen) return;

        // Bloquear scroll del body cuando el modal está abierto
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        // Manejar tecla ESC
        const handleEscape = (e) => {
            if (e.key === 'Escape' && closeOnEscape) {
                onClose();
            }
        };

        if (closeOnEscape) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = originalStyle;
            if (closeOnEscape) {
                document.removeEventListener('keydown', handleEscape);
            }
        };
    }, [isOpen, onClose, closeOnEscape]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose();
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay con difuminado */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300 ease-out"
                    onClick={handleOverlayClick}
                />

                {/* Modal */}
                <div
                    className={`
                        relative bg-white rounded-lg shadow-large w-full ${sizes[size]} 
                        transform transition-all duration-300 ease-out
                        animate-in slide-in-from-bottom-4 fade-in-0
                    `}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                            {title && (
                                <h3 className="text-lg font-semibold text-neutral-900">
                                    {title}
                                </h3>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-neutral-400 hover:text-neutral-600 transition-colors rounded-full p-1 hover:bg-neutral-100"
                                    aria-label="Cerrar modal"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default GlobalModal;