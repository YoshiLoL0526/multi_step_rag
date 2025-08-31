import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoginForm = () => {
    const { login, loading, error, clearError } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Limpiar errores cuando el componente se monta
        if (error) {
            clearError();
        }
    }, []);

    const validateForm = () => {
        const errors = {};

        if (!formData.email.trim()) {
            errors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'El email no es válido';
        }

        if (!formData.password.trim()) {
            errors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 3) {
            errors.password = 'La contraseña debe tener al menos 3 caracteres';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        clearError();
        const result = await login(formData.email, formData.password);

        if (!result.success) {
            // El error se maneja en el context
            console.error('Error de login:', result.error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        // Limpiar error del campo específico
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }

        // Limpiar error general si existe
        if (error) {
            clearError();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white shadow-medium rounded-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                        MultiStep RAG
                    </h1>
                    <p className="text-neutral-600">
                        Inicia sesión para acceder a tu cuenta
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={formErrors.email}
                        required
                        disabled={loading}
                    />

                    <Input
                        label="Contraseña"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={formErrors.password}
                        required
                        disabled={loading}
                    />

                    {error && (
                        <div className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-lg">
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-neutral-600">
                    <p>¿Necesitas ayuda? Contacta al administrador</p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;