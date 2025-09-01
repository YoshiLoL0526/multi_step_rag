const Input = ({
    label,
    error,
    type = 'text',
    placeholder,
    value,
    onChange,
    disabled = false,
    required = false,
    className = '',
    ...props
}) => {
    const inputClasses = `
    w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    ${error
            ? 'border-error-500 bg-error-50'
            : 'border-neutral-300 bg-white hover:border-neutral-400'
        }
    ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : ''}
    ${className}
  `.trim();

    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-neutral-700">
                    {label}
                    {required && <span className="text-error-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
                className={inputClasses}
                {...props}
            />
            {error && (
                <p className="text-sm text-error-600">{error}</p>
            )}
        </div>
    );
};

export default Input;