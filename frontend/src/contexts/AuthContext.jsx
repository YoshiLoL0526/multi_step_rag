import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';
import { useErrorHandler } from '../hooks/useErrorHandler'
import { useNotifications } from './NotificationContext';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload.user,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload.error,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null,
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const { handleError } = useErrorHandler();
    const { showSuccess } = useNotifications();

    useEffect(() => {
        const checkAuth = async () => {
            if (authService.isAuthenticated()) {
                const storedUser = authService.getStoredUser();
                if (storedUser) {
                    dispatch({ type: 'SET_USER', payload: { user: storedUser } });
                } else {
                    const result = await authService.getCurrentUser();
                    if (result.success) {
                        dispatch({ type: 'SET_USER', payload: { user: result.data } });
                    } else {
                        handleError(result, 'Error de autenticación')
                        authService.logout();
                    }
                }
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        dispatch({ type: 'LOGIN_START' });

        const result = await authService.login(email, password);

        if (result.success) {
            const userResult = await authService.getCurrentUser();
            if (userResult.success) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: { user: userResult.data }
                });
                return { success: true };
            } else {
                dispatch({
                    type: 'LOGIN_FAILURE',
                    payload: { error: userResult.error }
                });
                return { success: false, error: userResult.error };
            }
        } else {
            handleError(result, 'Error de autenticación')
            dispatch({
                type: 'LOGIN_FAILURE',
                payload: { error: result.error }
            });
            return { success: false, error: result.error };
        }
    };

    const logout = () => {
        authService.logout();
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        login,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    return context;
};