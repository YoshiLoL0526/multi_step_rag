import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-medium p-8 max-w-md w-full text-center">
                        <div className="h-16 w-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-error-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                            Algo salió mal
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            Ha ocurrido un error inesperado. Puedes intentar recargar la página.
                        </p>
                        <Button
                            variant="primary"
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Recargar página
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;