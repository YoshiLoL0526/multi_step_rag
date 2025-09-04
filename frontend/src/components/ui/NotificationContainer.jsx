import { useNotifications } from '../../contexts/NotificationContext';
import { X, AlertCircle, CheckCircle, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotifications();
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-success-600" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-error-600" />;
            default:
                return <AlertCircle className="h-5 w-5 text-neutral-600" />;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-success-50 border-success-200 text-success-800';
            case 'error':
                return 'bg-error-50 border-error-200 text-error-800';
            default:
                return 'bg-neutral-50 border-neutral-200 text-neutral-800';
        }
    };

    return (
        <>
            {/* Indicador de conexión */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 bg-error-600 text-white p-2 text-center text-sm z-60">
                    <div className="flex items-center justify-center space-x-2">
                        <WifiOff className="h-4 w-4" />
                        <span>Sin conexión a internet</span>
                    </div>
                </div>
            )}

            {/* Contenedor de notificaciones */}
            <div className={`fixed top-4 right-4 z-60 space-y-2 ${!isOnline ? 'mt-12' : ''}`}>
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`
                            max-w-md p-4 rounded-lg border shadow-lg animate-fade-in
                            ${getStyles(notification.type)}
                        `}
                    >
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">
                                        {notification.title}
                                    </h4>
                                    <button
                                        onClick={() => removeNotification(notification.id)}
                                        className="ml-2 flex-shrink-0 text-neutral-400 hover:text-neutral-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-sm mt-1 opacity-90">
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default NotificationContainer;