import { useState, useCallback, useMemo } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { SUPPORTED_FILE_TYPES } from '../../utils/constants';
import { useNotifications } from '../../contexts/NotificationContext';

const DocumentUpload = ({ onUpload, onClose, loading = false }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false)
    const { showError } = useNotifications()

    const validationConfig = useMemo(() => ({
        maxSize: 100 * 1024 * 1024,
        supportedTypes: Object.keys(SUPPORTED_FILE_TYPES),
        supportedExtensions: Object.values(SUPPORTED_FILE_TYPES).join(', ')
    }), []);

    const validateFile = useCallback((file) => {
        const { maxSize, supportedTypes } = validationConfig;

        if (!supportedTypes.includes(file.type)) {
            return 'Tipo de archivo no soportado. Solo se permiten PDF, TXT, DOCX y MD.';
        }

        if (file.size > maxSize) {
            return `El archivo es demasiado grande. Máximo ${(maxSize / 1024 / 1024).toFixed(0)}MB.`;
        }

        if (file.size === 0) {
            return 'El archivo está vacío.';
        }

        return null;
    }, [validationConfig]);

    const handleFiles = useCallback((files) => {
        const file = files[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            showError('Error al validar el archivo')
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    }, [showError, validateFile]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();

        if (loading) return;

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, [loading]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (loading) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, [loading, handleFiles]);

    const handleUpload = useCallback(async () => {
        if (!selectedFile || loading) return;

        setUploading(true)
        const result = await onUpload(selectedFile);
        setUploading(false);

        if (!result.success) {
            showError('Error al subir el archivo');
        }
        else {
            onClose()
        }
    }, [selectedFile, loading, onUpload, showError, onClose]);

    const removeFile = useCallback(() => {
        setSelectedFile(null);
    }, []);

    const DropZone = () => (
        <div
            className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${dragActive
                    ? 'border-primary-500 bg-primary-50 scale-105'
                    : selectedFile
                        ? 'border-primary-300 bg-primary-25'
                        : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100'
                }
                ${loading ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept={validationConfig.supportedExtensions}
                onChange={(e) => handleFiles(e.target.files)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                disabled={loading}
            />

            {selectedFile ? (
                <div className="flex items-center justify-center space-x-4">
                    <div className={`
                        h-12 w-12 rounded-full flex items-center justify-center
                        'bg-primary-100'
                    `}>
                        <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="text-left flex-1">
                        <p className={`font-medium text-primary-900`}>
                            {selectedFile.name}
                        </p>
                        <p className={`text-sm text-primary-600`}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    {!loading && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile();
                            }}
                            className="text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <Upload className={`h-16 w-16 mx-auto transition-colors ${dragActive ? 'text-primary-500' : 'text-neutral-400'
                        }`} />
                    <div>
                        <p className="text-lg font-medium text-neutral-900 mb-2">
                            {dragActive ? '¡Suelta tu archivo aquí!' : 'Arrastra tu documento aquí'}
                        </p>
                        <p className="text-sm text-neutral-600 mb-4">
                            O haz clic para seleccionar un archivo
                        </p>
                        <p className="text-xs text-neutral-500">
                            Formatos soportados: PDF, TXT, DOCX y MD (máx. {(validationConfig.maxSize / 1024 / 1024).toFixed(0)}MB)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <DropZone />

            {/* Botón de subida mejorado */}
            {selectedFile && (
                <Button
                    onClick={handleUpload}
                    disabled={loading || !selectedFile}
                    loading={uploading}
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                >
                    Subir documento
                </Button>
            )}
        </div>
    );
};

export default DocumentUpload;