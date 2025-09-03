import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = ({
    options = [],
    value,
    onChange,
    placeholder = 'Seleccionar...',
    disabled = false,
    label,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedOption = options.find(option => option.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            {label && (
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                className={`
                    relative w-full px-3 py-2 text-left bg-white border rounded-lg shadow-soft
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    ${disabled
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200'
                        : 'border-neutral-300 hover:border-neutral-400 cursor-pointer'
                    }
                `}
            >
                <span className="block truncate text-sm">
                    {selectedOption?.label || placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown
                        className={`h-4 w-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </span>
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-20 w-full bottom-full mb-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-neutral-500">
                            No hay opciones disponibles
                        </div>
                    ) : (
                        options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    w-full px-3 py-2 text-sm text-left hover:bg-neutral-50 transition-colors
                                    flex items-center justify-between cursor-pointer
                                    ${value === option.value ? 'bg-primary-50 text-primary-600' : 'text-neutral-900'}
                                `}
                            >
                                <span>{option.label}</span>
                                {value === option.value && (
                                    <Check className="h-4 w-4 text-primary-600" />
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Select;