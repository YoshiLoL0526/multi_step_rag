import { useState, useEffect } from 'react';
import { Zap, ChevronDown, Settings } from 'lucide-react';
import Select from '../ui/Select';

const LLM_PROVIDERS = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'gemini', label: 'Google Gemini' }
];

const LLM_MODELS = {
    openai: [
        { value: 'gpt-4o', label: 'GPT-4o' },
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        { value: 'gpt-o1', label: 'GPT-o1' },
        { value: 'gpt-o3', label: 'GPT-o3' }
    ],
    gemini: [
        { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
        { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
        { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
        { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
        { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }
    ]
};

const LLMSelector = ({
    provider,
    model,
    onProviderChange,
    onModelChange,
    disabled = false,
    isExpanded,
    onExpandedChange
}) => {
    const [availableModels, setAvailableModels] = useState([]);

    useEffect(() => {
        if (provider && LLM_MODELS[provider]) {
            setAvailableModels(LLM_MODELS[provider]);

            const modelExists = LLM_MODELS[provider].some(m => m.value === model);
            if (!modelExists && LLM_MODELS[provider].length > 0) {
                onModelChange(LLM_MODELS[provider][0].value);
            }
        } else {
            setAvailableModels([]);
        }
    }, [provider, model, onModelChange]);

    const handleProviderChange = (newProvider) => {
        onProviderChange(newProvider);
        if (LLM_MODELS[newProvider] && LLM_MODELS[newProvider].length > 0) {
            onModelChange(LLM_MODELS[newProvider][0].value);
        }
    };

    const currentProviderLabel = LLM_PROVIDERS.find(p => p.value === provider)?.label;
    const currentModelLabel = availableModels.find(m => m.value === model)?.label;

    return (
        <div className="bg-white border border-neutral-200 rounded-lg shadow-soft overflow-visible">
            {/* Header colapsable */}
            <button
                type="button"
                onClick={() => onExpandedChange?.(!isExpanded)}
                disabled={disabled}
                className="w-full px-3 py-2 flex items-center justify-between hover:bg-neutral-50 transition-colors disabled:cursor-not-allowed"
            >
                <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-primary-100 rounded-md flex items-center justify-center">
                        <Settings className="h-3 w-3 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-neutral-700">Modelo de IA</span>
                </div>

                <div className="flex items-center space-x-2">
                    {provider && model && (
                        <div className="flex items-center space-x-1 text-xs text-neutral-500">
                            <Zap className="h-3 w-3" />
                            <span className="hidden sm:inline">
                                {currentProviderLabel} - {currentModelLabel}
                            </span>
                            <span className="sm:hidden">
                                {currentModelLabel}
                            </span>
                        </div>
                    )}
                    <ChevronDown
                        className={`h-4 w-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''
                            }`}
                    />
                </div>
            </button>

            {/* Contenido expandible */}
            {isExpanded && (
                <div className="px-3 pb-3 border-t border-neutral-100 bg-neutral-50">
                    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Select
                            label="Proveedor"
                            options={LLM_PROVIDERS}
                            value={provider}
                            onChange={handleProviderChange}
                            placeholder="Seleccionar proveedor..."
                            disabled={disabled}
                        />

                        <Select
                            label="Modelo"
                            options={availableModels}
                            value={model}
                            onChange={onModelChange}
                            placeholder="Seleccionar modelo..."
                            disabled={disabled || !provider}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LLMSelector;