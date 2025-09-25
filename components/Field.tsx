import React from 'react';

interface FieldProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value: any;
  onChange: (value: any) => void;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
  id?: string; // Allow custom ID
}

export function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  onChange,
  options,
  children,
  id,
}: FieldProps) {
  const inputId = id || `field-${name || 'input'}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {children || (
        <>
          {type === 'select' && options ? (
            <select
              id={inputId}
              name={name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select {label || 'option'}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              id={inputId}
              name={name}
              placeholder={placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          ) : type === 'checkbox' ? (
            <div className="flex items-center">
              <input
                id={inputId}
                name={name}
                type="checkbox"
                checked={value || false}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor={inputId} className="ml-2 text-sm text-gray-700">
                {label || 'Checkbox'}
              </label>
            </div>
          ) : (
            <input
              id={inputId}
              name={name}
              type={type}
              placeholder={placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          )}
        </>
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export default Field;
