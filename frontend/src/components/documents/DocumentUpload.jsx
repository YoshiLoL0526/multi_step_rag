import { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { SUPPORTED_FILE_TYPES } from '../../utils/constants';

const DocumentUpload = ({ onUpload, loading = false }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);

    const validateFile = (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const supportedTypes = Object.keys(SUPPORTED_FILE_TYPES);

        if (!supportedTypes.includes(file.type)) {
            return 'Tipo de archivo no soportado. Solo se permiten PDF, TXT y DOCX.';
        }

        if (file.size > maxSize) {
            return 'El archivo es demasiado grande. Máximo 10MB.';
        }

        return null;
    };

    const handleFiles = (files) => {
        const file = files[0];
        if (!file) return;

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setSelectedFile(file);
        setError(null);
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const handleUpload = async () => {
        if (!selectedFile || loading) return;

        const result = await onUpload(selectedFile, (progress) => {
            setUploadProgress(progress);
        });

        if (result.success) {
            setSelectedFile(null);
            setUploadProgress(0);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setError(null);
        setUploadProgress(0);
    };

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${dragActive
                        ? 'border-primary-500 bg-primary-50'
                        : selectedFile
                            ? 'border-success-500 bg-success-50'
                            : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400'
                    }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept={Object.values(SUPPORTED_FILE_TYPES).join(',')}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={loading}
                />

                {selectedFile ? (
                    <div className="flex items-center justify-center space-x-3">
                        <FileText className="h-8 w-8 text-success-600" />
                        <div className="text-left">
                            <p className="font-medium text-success-900">{selectedFile.name}</p>
                            <p className="text-sm text-success-600">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={removeFile}
                            className="text-neutral-400 hover:text-neutral-600"
                            disabled={loading}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ) : (
                    <div>
                        <Upload className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                        <p className="text-lg font-medium text-neutral-900 mb-2">
                            Arrastra tu documento aquí
                        </p>
                        <p className="text-sm text-neutral-600 mb-4">
                            O haz clic para seleccionar un archivo
                        </p>
                        <p className="text-xs text-neutral-500">
                            Formatos soportados: PDF, TXT, DOCX (máx. 10MB)
                        </p>
                    </div>
                )}
            </div>

            {/* Progress bar */}
            {loading && uploadProgress > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Subiendo...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="flex items-center space-x-2 p-3 bg-error-50 border border-error-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-error-600" />
                    <p className="text-sm text-error-600">{error}</p>
                </div>
            )}

            {/* Upload button */}
            {selectedFile && (
                <Button
                    onClick={handleUpload}
                    disabled={loading || !selectedFile}
                    loading={loading}
                    className="w-full"
                >
                    {loading ? 'Subiendo documento...' : 'Subir documento'}
                </Button>
            )}
        </div>
    );
};

export default DocumentUpload;