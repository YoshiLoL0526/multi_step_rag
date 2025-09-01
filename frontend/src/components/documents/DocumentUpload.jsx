import { useState, useCallback, useMemo } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { SUPPORTED_FILE_TYPES } from '../../utils/constants';

const DocumentUpload = ({ onUpload, loading = false }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [uploadComplete, setUploadComplete] = useState(false);

    const validationConfig = useMemo(() => ({
        maxSize: 100 * 1024 * 1024,
        supportedTypes: Object.keys(SUPPORTED_FILE_TYPES),
        supportedExtensions: Object.values(SUPPORTED_FILE_TYPES).join(', ')
    }), []);

    const validateFile = useCallback((file) => {
        const { maxSize, supportedTypes } = validationConfig;

        if (!supportedTypes.includes(file.type)) {
            return 'Tipo de archivo no soportado. Solo se permiten PDF, TXT y DOCX.';
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
            setError(validationError);
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setError(null);
        setUploadComplete(false);
        setUploadProgress(0);
    }, [validateFile]);

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

        setError(null);
        setUploadComplete(false);

        const result = await onUpload(selectedFile, (progress) => {
            setUploadProgress(progress);
        });

        if (result.success) {
            setUploadComplete(true);
            setTimeout(() => {
                setSelectedFile(null);
                setUploadProgress(0);
                setUploadComplete(false);
            }, 2000);
        } else {
            setError(result.error || 'Error al subir el archivo');
        }
    }, [selectedFile, loading, onUpload]);

    const removeFile = useCallback(() => {
        setSelectedFile(null);
        setError(null);
        setUploadProgress(0);
        setUploadComplete(false);
    }, []);

    const DropZone = () => (
        <div
            className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${dragActive
                    ? 'border-primary-500 bg-primary-50 scale-105'
                    : selectedFile
                        ? uploadComplete
                            ? 'border-success-500 bg-success-50'
                            : 'border-primary-300 bg-primary-25'
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
                        ${uploadComplete ? 'bg-success-100' : 'bg-primary-100'}
                    `}>
                        {uploadComplete ? (
                            <CheckCircle className="h-6 w-6 text-success-600" />
                        ) : (
                            <FileText className="h-6 w-6 text-primary-600" />
                        )}
                    </div>
                    <div className="text-left flex-1">
                        <p className={`font-medium ${uploadComplete ? 'text-success-900' : 'text-primary-900'}`}>
                            {selectedFile.name}
                        </p>
                        <p className={`text-sm ${uploadComplete ? 'text-success-600' : 'text-primary-600'}`}>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {uploadComplete && (
                            <p className="text-xs text-success-600 mt-1">
                                ¡Archivo subido exitosamente!
                            </p>
                        )}
                    </div>
                    {!loading && !uploadComplete && (
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
                            Formatos soportados: PDF, TXT, DOCX (máx. {(validationConfig.maxSize / 1024 / 1024).toFixed(0)}MB)
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <DropZone />

            {/* Barra de progreso mejorada */}
            {loading && uploadProgress > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-neutral-700">Subiendo archivo...</span>
                        <span className="text-primary-600 font-semibold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                    <p className="text-xs text-neutral-500 text-center">
                        Por favor, no cierres esta ventana mientras se sube el archivo
                    </p>
                </div>
            )}

            {/* Mensaje de error mejorado */}
            {error && (
                <div className="flex items-start space-x-3 p-4 bg-error-50 border border-error-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-error-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-error-800 mb-1">Error al procesar archivo</p>
                        <p className="text-sm text-error-700">{error}</p>
                    </div>
                </div>
            )}

            {/* Botón de subida mejorado */}
            {selectedFile && !uploadComplete && (
                <Button
                    onClick={handleUpload}
                    disabled={loading || !selectedFile}
                    loading={loading}
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                >
                    {loading ? `Subiendo... ${uploadProgress}%` : 'Subir documento'}
                </Button>
            )}
        </div>
    );
};

export default DocumentUpload;